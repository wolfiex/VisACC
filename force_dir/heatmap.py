import json
import pandas as pd

with open('locations.json') as json_data:
    d = json.load(json_data)

nodes= d['nodes']
links = d['links']

ndf = pd.DataFrame([ [float(i['x']), float(i['y'])] for i in nodes ])
ndf.columns=['x','y']


from matplotlib import pyplot as plt
import numpy as np
from matplotlib import cm as CM
from scipy import interpolate
from scipy.interpolate import griddata

z = np.array([ abs((float(i['vx'])**2 +float(i['vy'])**2)**0.5) for i in nodes ])


gridsize=30
#fig = plt.figure(figsize=(620/400, 579/400), dpi=400)
plt.subplot(111)

# if 'bins=None', then color of each hexagon corresponds directly to its count
# 'C' is optional--it maps values to x-y coordinates; if 'C' is None (default) then
# the result is a pure 2D histogram
x=np.array(ndf.x)
y=np.array(ndf.y)




import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm


global grid
grid = np.zeros((2000,2000), dtype=int, order='C')

for i in xrange(len(x)):
    grid[x[i]+1000,y[i]+1000]=100*x[i]
    for j in xrange(100):
        for k in xrange(100):
            grid[x[i]+j+1000,y[i]+k+1000]=100*x[i]

coords = [[i,j]for i in xrange(2000)for j in xrange(2000)]



for rn in xrange(14):
    print 'cycle',rn
    for ij in coords:
        i,j=ij
        sums = 0
        if i>0 and j<2000-1:
            sums+= grid[i-1,j+1]
        if j>0 and i<2000-1:
            sums+= grid[i+1,j-1]
        if i>0 and j>0:
            sums+= grid[i-1,j-1]
        if i<2000-1 and j<2000-1:
            sums+= grid[i+1,j+1]
        for q in xrange(4):
            for w in xrange(4):
                try:grid[i+q,j+w]+=sums/4
                except:None

plt.imshow(grid, interpolation='sinc',filternorm=0.5, filterrad=10.0, alpha=0.8 )
#plt.hexbin(x, y, C=z, gridsize=gridsize, cmap=cm.jet, bins=None)
plt.savefig('hm.png')
