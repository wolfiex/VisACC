import numpy as np
import multiprocessing, math
import json

with open('locs.json') as data_file: data = json.load(data_file)
global edges, mean_edge , norm
edges = [i['value'] for i in data['links']]
mean_edge= np.mean(edges)
global datastring
datastring =''

norm = np.sum([abs(mean_edge - x) for  x in edges])

# logbase , root , powerx
def f_111 (code) : return np.sum([abs(mean_edge - ( (np.abs(math.log(x+1e-9,code[0])/math.log(1e-9,code[0])) + x**(1./code[1]) + x**code[2]) )) for x in edges]) /norm

def f_110 (code) : return np.sum([ abs(mean_edge - (math.log(x+1e-9,code[0])/math.log(1e-9,code[0])) + x**(1./code[1]) ) for  x in edges])/norm
def f_101 (code) : return np.sum([ abs(mean_edge - (abs(math.log(x+1e-9,code[0])/math.log(1e-9,code[0])) + x**code[1] )) for  x in edges])/norm
def f_011 (code) : return np.sum([ abs(mean_edge - (x**(1./code[0]) + x**code[1] )) for  x in edges])/norm

def f_100 (code) : return np.sum([ abs(mean_edge - (abs(math.log(x+1e-9,code[0])/math.log(1e-9,code[0])) )) for  x in edges])/norm
def f_001 (code): return np.sum([abs(mean_edge - (x**code[0] )) for  x in edges])/norm
def f_010 (code) : return np.sum([abs(mean_edge - ( x**(1./code[0]) )) for  x in edges])/norm


functions = ['111','110','011','101','010','100','001']

#functions = ['011']

styles = {'random':0,'mutate':1,'mate':2,'':3}

class Gene:
    'a class for each gene'

    def __init__(self, code=True, value=9999, nvals = 1, id=[0], origin=[]):

        self.id = id
        self.origin = origin
        self.value = value
        self.elements = nvals
        self.range= [15]*nvals
        self.min=[-2]*nvals
        self.style = ''
        if str(code): self.random()
        else: self.code = code

    def __lt__(self, other): #less than method
        return self.value < other.value

    def random (self):
        self.code = np.random.random(self.elements)*self.range+self.min
        self.style='random'

    def mutate (self):
        prob = 0.8
        magnitude = .1
        sign =  np.random.random_integers(-1,1,3)
        mutate_factor = [np.random.random()*magnitude*i  for i in sign]
        self.code = [self.code[i] + mutate_factor[i] for i in xrange(self.elements)]

    def copy(self):
        return Gene( code=self.code, value=self.value, nvals = self.elements, id=self.id, origin=self.origin)



class Population:
    def __init__(self, size, function, generation=0, runs=100, nvals=1):
        self.nvals=nvals
        self.f = function
        self.runs = runs
        self.generation=generation
        self.members=[]
        self.size=int(size)
        self.history = [None]*runs

    def spawn (self):
        self.members = [  Gene(nvals=self.nvals) for i in xrange(self.size)]
        self.history[0] = self.members

    def getcode(self):
        return [i.code for i in p.members]

    def getval(self):
        return [i.value for i in p.members]

    def duplicate (self):
        values =[]
        for i in xrange(self.size):
            gene = self.members[i].copy()
            if gene.value not in values:
                values.append(gene.value)
            else:
                gene =   Gene(nvals=self.nvals)
                try:value = self.f(next_member[i].code)
                except: value = -1
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
                gene = self.members[i].copy()

                gene.origin = list(gene.id)
                next_member.append(gene)

            #mutate top percenage for mutation
            elif i<(p_keep+p_mutate) :
                gene = self.members[counter].copy()
                gene.mutate()

                gene.origin = list(gene.id)
                gene.style = 'mutate'
                #gene.origin=[self.size*(self.generation-1)+counter]
                next_member.append(gene)
                counter += 1


            #top set becomes increasingly attracted to power
            elif i<(p_keep+p_mutate+p_mate):
                while True:
                    gene1 = self.members[np.random.random_integers(0,round(p_mate))].copy()
                    gene2 = self.members[np.random.random_integers(0,round(p_mate))].copy()
                    if gene1 is not gene2: break

                index = np.random.random_integers(0,gene1.elements-1)
                dummy = gene1.code[index]

                gene1.code[index]= gene2.code[index]
                gene2.code[index] = dummy
                gene1.origin = list(gene1.origin)+list(gene2.origin)
                gene2.origin = list(gene1.origin)

                gene1.style='mate'
                gene2.style='mate'

                next_member.append(gene1)
                next_member.append(gene2)

                    #some newcommers enter the scene (possibly)
            else:
                next_member.append(  Gene(nvals=self.nvals))



        dummy = self.size*(self.generation-1)
        for i in xrange(self.size):
            next_member[i].id = [dummy + i]
            #print next_member[i].code

            try:value = self.f(next_member[i].code)
            except: value = -1
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
        print '\n',self.getval()[:2]
        print '\n',self.getcode()[:2]





results= []

for fun in functions:
    nval= 0
    for f in [0,1,2]:
        f= str(fun)[f]
        try: nval+= int(f)
        except:None

    p = Population(100, eval('f_%s'%fun), runs = 350, nvals=nval )
    p.spawn()
    p.start()
    print fun
    results.append(p)
    datastring = datastring + '\n    ' +str(p.getval()[0]) + '    Coefficients :    ' + str(p.getcode()[0]) + '       Type:  '+str(fun)



allres=[]
for i in results: allres.extend(i.members)


def jsonify (members,generation,col):
    nodes=[]
    links=[]
    for i in members:
        if i.value <900 : nodes.append({'name':str(i.id[0]),'generation':generation,'fitness':i.value})
        for j in i.origin:
            links.append({'source':(j),'target':(i.id[0]),'op':styles[i.style]})

    return nodes,links

nodes = []
links = []
for i in xrange(1,10):
    dummy = jsonify(p.history[3],i,0 )
    nodes.extend(dummy[0])
    links.extend(dummy[1])






dataset = '{  "population_size" : '+ str(len(nodes)) +',   "nodes" :' + str(nodes) + ', "links" : ' + str(links) + '}'
dataset = dataset.replace("'",'"').replace('},','},\n')

f = open('ga.json','w')
f.write(dataset)
f.close()

print datastring
