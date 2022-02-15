from collections import deque
from datetime import datetime
import time
from pathlib import Path
from typing import Union
import os
from fastdtw import fastdtw
from scipy.spatial.distance import euclidean
import librosa
import numpy as np
import sounddevice as sd
from scipy.spatial import distance
from scipy.signal import fftconvolve
from scipy.io import wavfile
import json
import matplotlib.pyplot as plt
from os import popen,system
from time import sleep

wifi_connected = False
display_on = False
ip="192.168.86.26"

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

class AudioHandler:
    def __init__(self) -> None:
        self.DIST_THRESHOLD = 75
        self.sr = 44100
        self.sec = 2
        self.smoothing = 10
        self.num_samples = 2

        self.samples = []
        for i in range(self.num_samples):
            with open('click' + str(i+1) + '.json', 'r') as file:
                self.samples.append(np.array(json.load(file)))

        self.sample_mfccs = []
        self.historical_mfcc = []
        for i in range(3):
            with open("./mfcc_features/mfcc" + str(i + 1) + ".json", 'r') as file:
                features = np.array(json.load(file))
                self.sample_mfccs.append(features)
                self.historical_mfcc.append([])

    def get_rule_vote(self, sample):
        sample = np.absolute(sample)
        std = np.std(sample)
        avg = np.mean(sample)
        upper_threshold = avg + 10 * std
        lower_threshold = avg + 7 * std
        onPeak = False
        onePeakTime = 0
        onePeak = False

        for i in range(int(len(sample) / self.smoothing)):
            sample_subset = sample[i*self.smoothing:(i+1) * self.smoothing]
            amp = np.mean(sample_subset)
            if amp > upper_threshold and not onPeak:
                onPeak = True
                if not onePeak:
                    onePeak = True
                elif onePeakTime > i * self.smoothing - self.sr / 2:
                    return True
            elif amp < lower_threshold and onPeak:
                if onePeak and onPeak:
                    onePeakTime = i * self.smoothing
                onPeak = False
        return False

    def get_mfcc_vote(self, sample):
        mfcc_features = self.compute_mean_mfcc(sample, self.sr)
        votes = 0
        for i in range(3):
            d, path = fastdtw(self.sample_mfccs[i], mfcc_features, dist=euclidean)
            self.historical_mfcc[i].append(d)
            if len(self.historical_mfcc[i]) <= 3:
                continue
            avg = np.mean(self.historical_mfcc[i])
            std = np.std(self.historical_mfcc[i])
            if d < avg - std:
                votes += 1
        return votes > self.num_samples / 2.0


    def get_correlation_vote(self, sample):
        votes = 0
        for i in range(self.num_samples):
            correlation = self.correlation_similarity(sample, self.samples[i])
            if correlation > 3:
                votes += 1
        return votes > self.num_samples / 2.0


    def start_detection(self) -> None:
        j = 0
        timeout = 12 * 60 * 60  # [seconds]
        timeout_start = time.time()
        print("starting")
        prev_sound = np.array([])
        nmap = ""
        while time.time() < timeout_start + timeout:
            j += 1
            sound_record = sd.rec(
                int(self.sec * self.sr),
                samplerate=self.sr,
                channels=1,
                blocking=True,
            ).flatten()

            print("")
            print("results")
            print("mfcc", self.get_mfcc_vote(sound_record))
            print("rule", self.get_rule_vote(sound_record))
            print("correlation", self.get_correlation_vote(sound_record))
            # with open("./mfcc_features/mfcc" + str(j) + ".json", 'w') as outfile:
            #     json.dump(features, outfile,cls = NumpyEncoder)
            #     print(j)

            if j % 4 == 0:
                nmap_out=str(popen('nmap -sP '+ip).read())
            if j % 5 == 0:
                j = 0
                if nmap_out.find('latency') == -1 and wifi_connected:
                    wifi_connected = False
                    if display_on:
                        display_on = False
                        system('vcgencmd display_power 0')
                elif nmap_out.find('latency') > 1 and not wifi_connected:
                    wifi_connected = True
                    if not display_on:
                        display_on = True
                        system('vcgencmd display_power 1') #Bash command to turn on the display

    def correlation_similarity(self, sample, recording):
        corr = fftconvolve(sample, recording)    
        return max(abs(corr))

    def compute_mean_mfcc(self, audio, sr, dtype="float32"):
        mfcc_features = librosa.feature.mfcc(audio, sr=sr, dtype=dtype, n_mfcc=20)
        return np.mean(mfcc_features, axis=1)

if __name__ == '__main__':
    AudioHandler().start_detection()
