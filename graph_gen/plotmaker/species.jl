
using RCall,Blink

specs = ["CH4","CH3O2NO2","H2","N2O5","H2O2","CH3OH","HONO","CO","HO2NO2","CH3O","CH3NO3","HNO3","CH3OOH","HCHO","CH3O2","NO3","OH","NO2","NO","O3","HO2"]

species = specs[1]
@rput species



rfile = pwd()*"/gen.R"
@rput rfile
R"source(rfile)"

w = Window
loadurl(w, "index.html")
