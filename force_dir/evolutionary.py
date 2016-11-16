import numpy as np
import multiprocessing, math
import json

with open('locs.json') as data_file: data = json.load(data_file)

edges = [i['value'] for i in data['links']]

# logbase , root , power
def f_111  (self, x,ga): return np.abs(math.log(self, x+1e-9,ga[0])/math.log(1e-9,ga[0])) + x**(1./ga[1]) + x**ga[2]

def f_110  (self, x,ga): return np.abs(math.log(self, x+1e-9,ga[0])/math.log(1e-9,ga[0])) + x**(1./ga[1])
def f_101  (self, x,ga): return np.abs(math.log(self, x+1e-9,ga[0])/math.log(1e-9,ga[0])) + x**ga[1]
def f_011  (self, x,ga): return x**(1./ga[0]) + x**ga[1]

def f_100  (self, x,ga): return np.abs(math.log(self, x+1e-9,ga[0])/math.log(1e-9,ga[0]))
def f_001  (self, x,ga): return x**ga[0]
def f_010  (self, x,ga): return x**(1./ga[0])


class Gene:
    'a class for each gene'
    def __init__(self, code=[], value=9999):
            self.value = value
            self.elements = 1
            self.code=code
            self.range= [1]
            self.min=[1]

    def random (self):
        self.code = np.random.random(self.elements)*self.range+self.min

    def mutate (self)


class Population:
    def __init__(self, size, generation=1):
        self.generation=generation
        self.members=[]
        self.size=size

    def spawn (self):
        self.members = [Gene() for i in xrange(self.size)]
