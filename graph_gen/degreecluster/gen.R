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


  return(mixclust$parameters$mean[,strtoi(num[1])])

}
