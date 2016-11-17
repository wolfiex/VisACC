import numpy as np
import multiprocessing, math
import json

with open('locs.json') as data_file: data = json.load(data_file)
global edges
edges = [i['value'] for i in data['links']]

# logbase , root , powerx
def f_111 (code) : return np.mean([ (np.abs(math.log(x+1e-9,code[0])/math.log(1e-9,code[0])) + x**(1./code[1]) + x**code[2]) for x in edges])

def f_110 (code) : return np.mean([ np.abs(math.log(x+1e-9,code[0])/math.log(1e-9,code[0])) + x**(1./code[1]) for x in edges])
def f_101 (code) : return np.mean([ np.abs(math.log(x+1e-9,code[0])/math.log(1e-9,code[0])) + x**code[1] for x in edges])
def f_011 (code) : return np.mean([ x**(1./code[0]) + x**code[1] for x in edges])

def f_100 (code) : return np.mean([ np.abs(math.log(x+1e-9,code[0])/math.log(1e-9,code[0])) for x in edges])
def f_001 (code): return np.mean([x**code[0] for x in edges])
def f_010 (code) : return np.mean([ x**(1./code[0]) for x in edges])

class Gene:
    'a class for each gene'

    def __init__(self, code=True, value=9999):

        self.id = [0]
        self.origin = []
        self.value = value
        self.elements = 1
        self.range= [15]
        self.min=[1]
        self.style = ''
        if (code): self.random()
        else: self.code = code

    def __lt__(self, other): #less than method
        return self.value < other.value

    def random (self):
        self.code = np.random.random(self.elements)*self.range+self.min
        self.style='random'

    def mutate (self):
        prob = 0.9
        magnitude = 1
        sign = np.array([ -1 * np.random.random(self.elements) if (i<=0.5) else np.random.random(self.elements) for i in np.random.random(self.elements)])
        mutate_factor = np.array([ 1 if (i<=prob) else 0 for i in np.random.random(self.elements)])* sign * magnitude
        self.code = self.code + mutate_factor





class Population:
    def __init__(self, size, function, generation=0, runs=100):
        self.f = function
        self.runs = runs
        self.generation=generation
        self.members=[]
        self.size=int(size)
        self.history = [None]*runs

    def spawn (self):
        self.members = [Gene() for i in xrange(self.size)]

    def getcode(self):
        return [i.code for i in p.members]

    def getval(self):
        return [i.value for i in p.members]

    def duplicate (self):
        values =[]
        for i in xrange(self.size):
            gene = self.members[i]
            if gene.value not in values:
                values.append(gene.value)
            else:
                gene = Gene()
                value = self.f(gene.code)
                gene.value = 999 if (value <=0) else value
                self.members[i] = gene



    def next_gen(self):
        #to stop saving history uncomment this line
        self.history[self.generation] = self.members

        self.generation += 1
        next_member = []
        p_keep = self.size * 0.10
        p_mutate = self.size * 0.6
        p_mate = self.size* (0.3 / 2 ) # mates randomly from the top pmate/2 percent %

        counter = 0
        for i in xrange(self.size):
            #keep top percentage
            if i<p_keep:
                gene = self.members[i]
                gene.origin = gene.id
                next_member.append(gene)

            #mutate top percenage for mutation
            elif i<(p_keep+p_mutate) :
                gene = self.members[counter]
                gene.mutate()
                gene.origin = gene.id
                gene.style = 'mutate'
                #gene.origin=[self.size*(self.generation-1)+counter]
                next_member.append(gene)
                counter += 1


            #top set becomes increasingly attracted to power
            elif i<(p_keep+p_mutate+p_mate):
                while True:
                    gene1 = self.members[np.random.random_integers(0,round(p_mate))]
                    gene2 = self.members[np.random.random_integers(0,round(p_mate))]
                    if gene1 is not gene2: break

                index = np.random.random_integers(0,gene1.elements-1)
                dummy = gene1.code[index]

                gene1.code[index]= gene2.code[index]
                gene2.code[index] = dummy

                gene1.origin = gene1.origin+gene2.origin
                gene2.origin = gene1.origin

                gene1.style='mate'
                gene2.style='mate'

                next_member.append(gene1)
                next_member.append(gene2)

                    #some newcommers enter the scene (possibly)
            else:
                next_member.append(Gene())



        dummy = self.size*(self.generation-1)
        for i in xrange(self.size):

            next_member[i].id = [dummy + i]
            value = self.f(next_member[i].code)
            next_member[i].value = 999 if (value <=0) else value

        self.members = next_member
        self.duplicate()
        self.members.sort()




    def start(self):
        for run in xrange(self.runs):
            self.next_gen()

            if run%10 == 0 :print 'Running:',run

        self.duplicate()
        self.members.sort()
        print self.getval()[:5]


p = Population(100,f_001, runs = 300 )
p.spawn()
