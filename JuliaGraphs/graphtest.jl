#!/usr/bin/julia

#include("./graphtest.jl")

using LightGraphs

using NetCDF

filename = "../netcdf_results/nhept.nc"
println(ncinfo(filename))
x = ncread(filename, "source")




println(" loadit ")


A = [
           0 1 1
           1 0 1
           1 0.4 0
       ]

G = DiGraph(A)
