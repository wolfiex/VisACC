df_full = read.csv('global.csv')
library(MASS)
library(ggplot2)


#Rscript --vanilla densityplot.R O3

print (commandArgs(trailingOnly=TRUE))
maxno=max(unlist(df_full),na.rm=TRUE)
minno=min(unlist(df_full),na.rm=TRUE)


for (i in commandArgs(trailingOnly=TRUE)){
species = i  #'CH4'

df =  df_full[c(paste0(species,'_x'),paste0(species,'_y'))]
colnames(df) = c("x","y")
df = (df-minno)/maxno


#normalized = (x-min(x))/(max(x)-min(x))
colMax <- function(data) sapply(data, max, na.rm = TRUE)
colSort <- function(data, ...) sapply(data, sort, ...)



df[dim(df[1])+1,1]= 0
df[dim(df[1]),2]= 0
df[dim(df[1])+1,1]= 1
df[dim(df[1]),2]= 1

p=ggplot(data=df,aes(x,y)) +
geom_point(data= df,shape = 21, fill = 'transparent',col = 'transparent')+
geom_density2d(alpha=1,size=.2,aes(colour=..level..))  +
theme_bw() + theme(panel.border = element_blank(), panel.grid.major = element_blank(),
panel.grid.minor = element_blank(), axis.line = element_line(colour = "black"))+
theme(legend.position="none")+
theme(plot.margin=unit(c(0,0,0,0),"cm"))+
theme(
axis.title.x=element_blank(),
axis.text.x=element_blank(),
axis.ticks.x=element_blank(),
axis.title.y=element_blank(),
axis.text.y=element_blank(),
axis.ticks.y=element_blank(),
panel.grid = element_blank(),
panel.border = element_blank(),
#line = element_blank(),
text = element_blank(),
line = element_blank(),
title = element_blank()
)

filename = paste0("r",species,".svg")
ggsave(file=filename, plot=p, width=10, height=10)

}
