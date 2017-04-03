using Blink,RCall
w = Window()
loadurl(w, "file://"*pwd()*"/index.html")
sleep(1)



rfile = pwd()*"/gen.R"
@rput rfile
R"source(rfile)"



specs = ["CH4","CH3O2NO2","H2","N2O5","H2O2","CH3OH","HONO","CO","HO2NO2","CH3O","CH3NO3","HNO3","CH3OOH","HCHO","CH3O2","NO3","OH","NO2","NO","O3","HO2"]

data = []

for i in specs
    res = R"points($i,minno,maxno)"
    push!(data,[i,[res[1],res[2]]])

end

data


@js w data = $(data)
@js w JSON.stringify(data)
