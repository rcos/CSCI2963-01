10/3/2015 Lecture is found here https://github.com/rcos/StatComputing

Sample Code in R written in class








## Plotting commands and Distributions

x <- seq(-4, 4, 0.1)

plot(x, dnorm(x,1,0.25), type = "l") 

y <- 0:30

plot(y, dbinom(y, 30, 0.25), type = "h")

curve(runif(x),-3, 3)

curve(sin, -2*pi, 2*pi, xname = "t")

curve ( dunif ( x , min = 2 , max = 6 ))










###Monty Hall Problem

car_placed_door<-sample(1:3,1000,replace=TRUE)

car_selection_door<-sample(1:3,1000,replace=TRUE)

sum(car_placed_door==car_selection_door)
