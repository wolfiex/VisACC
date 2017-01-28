
fontname = 'pixigraph'
width = 148

#   &#x0030    U+0030

htmlunicode = []
char=[]
for i in tuple(open('unicode.csv')):
    j = i.split(',')
    htmlunicode.append('&#x' + j[0].split('+')[1])
    char.append(j[1])

unidict = dict(zip(char,htmlunicode))



content = '''<?xml version="1.0"?>
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<metadata>

		Project: pixigraph
		Font exported on 2016-12-29 at 17:49:04

		Created by Daniel Ellis
        daniel.ellis.research@googlemail.com
		Version 1.07


	</metadata>
	<defs>
		<font id="pixigraph" horiz-adv-x="1000">
			<font-face
				units-per-em="502"
				cap-height="502"
				x-height="502"
				ascent="505"
				descent="0"
				bbox="0, 0, 0, 0"
				unicode-range="U+20-126"
				font-family="''' +fontname+ '''"
				font-style="normal"
				panose-1="2 0 0 0 0 0 0 0 0 0"
				designer="Daniel Ellis"
				designerURL="www-users.york.ac.uk/~dp626/"
				manufacturer="daniel.ellis.research@googlemail.com"
				manufacturerURL=""
				license=""
				licenseURL=""
				version=""
				description=""
				copyright=""
				trademark=""
				font-variant="normal"
				font-weight="400"
				font-stretch="normal"
				stemv=""
				stemh=""
				slope=""
				underline-position="0"
				underline-thickness="0"
				strikethrough-position="00"
				strikethrough-thickness="0"
				overline-position="0"
				overline-thickness="0">
				<font-face-src>
					<font-face-name name="pixigraph" />
				</font-face-src>
			</font-face>

         	<missing-glyph horiz-adv-x="309" d="M0,0 v500 h309 v-500 h-309z M5,5 v490 h299 v-490 h-299z" />

			<!-- Ligatures M- move x,y  L line to x y fill='red?'  Z close path -->

            '''
#i char1 char2
#"M 0 0 L 300 0 L 300 30 L 00 30z"
#<glyph glyph-name="Ligature_%s" unicode="%s;%s;" horiz-adv-x="148" d="" />

perm = []
for i in [0,1,2,3,4,5,6,7,8,9,'^']:
    for j in [0,1,2,3,4,5,6,7,8,9,'^']:
            perm.append([i,j])

thickenss = 8
for i in xrange(len(perm)):
    val = perm[i]
    try: start = int(val[0])*100
    except: start = 1000
    try: end = int(val[1])*100
    except: end = 1000



    x1 = '%s,%s'%(0,(start-thickenss)/2)
    x2 = '%s,%s'%(0,(start+thickenss)/2)
    x3 = '%s,%s'%(width,(end+thickenss)/2)
    x4 = '%s,%s'%(width,(end-thickenss)/2)

    #d = 'M %s C%s,%s,%s C%s,%s,%s C%s,%s,%s C%s,%s,%s z'%(x1,x1,x2,x2,x2,x3,x3,x3,x4,x4,x4,x1,x1)
    d = 'M %s L%s L%s L%s L%s'%(x1,x2,x3,x4,x1)
    content = content + '<glyph glyph-name="Ligature_%s" unicode="%s;%s;" horiz-adv-x="148" d="%s" fill="red"/> \n'%(i,unidict[str(val[0])],unidict[str(val[1])],d)



content = content + '''		</font>
    	</defs>

    	<text x="100" y="150" style="font-size:48px;" font-family="pixigraph">pixigraph</text>
    	<text x="100" y="220" style="font-size:48px;" font-family="pixigraph">ABCDEFGHIJKLMNOPQRSTUVWXYZ</text>
    	<text x="100" y="290" style="font-size:48px;" font-family="pixigraph">abcdefghijklmnopqrstuvwxyz</text>
    	<text x="100" y="360" style="font-size:48px;" font-family="pixigraph">1234567890</text>
    	<text x="100" y="430" style="font-size:48px;" font-family="pixigraph">!"#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~</text>
        <text x="100" y="460" style="font-size:480px;" font-family="pixigraph">02 25 5^ ^3 32 27 75 59 98 87 78 88 89 97</text>
    </svg>'''



f = open('generatedfont.svg','w')
f.write(content)
f.close()
