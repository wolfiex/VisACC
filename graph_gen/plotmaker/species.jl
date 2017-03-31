
using RCall,Blink
w = Window()
sleep(2)


specs = ["CH4","CH3O2NO2","H2","N2O5","H2O2","CH3OH","HONO","CO","HO2NO2","CH3O","CH3NO3","HNO3","CH3OOH","HCHO","CH3O2","NO3","OH","NO2","NO","O3","HO2"]





for i in 6:length(specs)
species = specs[i]
@rput species
rfile = pwd()*"/gen.R"
@rput rfile
R"source(rfile)"
sleep(4)
@rget names
@rget df


function runfn() 

    loadurl(w, "file://"*pwd()*"/index.html")
    sleep(1)



    @js w cl=$names
    @js w eval("window.coords=cl.coords[0].map((d,i)=>[d,cl.coords[1][i]])")

    @js w species=$species
    @rget df
    @js w df=$df
    @js w sum =  $(normalize(names[Symbol("sum")]))
    @js w order =  $(names[Symbol("order")])
    @js w cols =  $(names[Symbol("class")])
    @js w ellipse = $(names[Symbol("ellipse")])
    @js w points()
    
end


try runfn() end

sleep(3)
@js w savesvg()


end
#