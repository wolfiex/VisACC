df_full = read.csv('global.csv')
library(mclust)
library("grid")

maxno=max(unlist(df_full),na.rm=TRUE)
minno=min(unlist(df_full),na.rm=TRUE)


points = function(species,maxno,minno){
  df =  df_full[c(paste0(species,'_x'),paste0(species,'_y'))]
  colnames(df) = c("x","y")
  df = (df-minno)/maxno


  mixclust = Mclust(df)

  num = names(sort(summary(as.factor(mixclust$classification)), decreasing=T))
  clusters = lapply(num, function(x) mixclust$parameters$mean[,strtoi(x)])
  clust = t(data.frame(clusters))


  colnames(df) = c("x","y")
  colnames(clust) = c("x","y")
  rownames(clust) = num

  names={}
  names$df=df
  names$order=num
  names$coords=clust
  names$class = mixclust$classification
  names$sum = summary(as.factor(mixclust$classification))
  return (names)
}
