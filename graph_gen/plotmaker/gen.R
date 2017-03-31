df_full = read.csv('global.csv')
library(MASS)
library(ggplot2)
library(mclust)
library("grid")


#species = 'CH4'
df =  df_full[c(paste0(species,'_x'),paste0(species,'_y'))]
mixclust = Mclust(df)

num = names(sort(summary(as.factor(mixclust$classification)), decreasing=T))
clusters = lapply(num, function(x) mixclust$parameters$mean[,strtoi(x)])
clust = t(data.frame(clusters))


colnames(df) = c("x","y")
colnames(clust) = c("x","y")
rownames(clust) = num

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

names={}
names$order=num
names$coords=clust
names$file = filename
names$class = mixclust$classification
names$ellipse = mixclust$parameters$variance$shape
names$sum = summary(as.factor(mixclust$classification))


ggsave(file=filename, plot=p, width=10, height=10)





.f = function() {
unused
#gt <- ggplot_gtable(ggplot_build(p))
#ge <- subset(gt$layout, name == "panel")
#grid.draw(gt[ge$t:ge$b, ge$l:ge$r])

## now save as svg
install.packages('package_name', dependencies=TRUE, repos='http://cran.rstudio.com/')

options(repos='http://cran.rstudio.com/')

packages <- function(pkg){
    new.pkg <- pkg[!(pkg %in% installed.packages()[, "Package"])]
    if (length(new.pkg))
        install.packages(new.pkg, dependencies = TRUE, repos='https://cran.rstudio.com/')
    sapply(pkg, require, character.only = TRUE)
}

packages(c("foo", "bar", "baz"))
}
