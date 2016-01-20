## Lab 9 (11/6/2015) on Statistical Computing/Open Data/Data Science/Machine Learning

Data Science, Statistical Modeling and Machine learning are important, current topics in Computer Science. There has been a lot of open source software and open data available.

[This site](http://www.analyticsvidhya.com/blog/2014/11/data-science-projects-learn/) recommends five projects to try in order to learn data science. In this lab you will be doing the first project - namely Titanic Data. This is available on [kaggle](https://www.kaggle.com/c/titanic) (Kaggle holds competitions on machine learning/data science - A couple of years ago, one RPI student Diogo(also worked in RCOS) won first place in the [cause-effect pairs competition](https://www.kaggle.com/c/cause-effect-pairs/forums/t/5702/code-of-top-ranking-participants/30618) and [his code can be found here](http://rcos.rpi.edu/projects/protoml/) - So you too can participate in the near future and win)

Now back to the titanic

Titanic dataset is [available in R](https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/Titanic.html) and  in [csv format](https://vincentarelbundock.github.io/Rdatasets/csv/datasets/Titanic.csv)

For this lab, please do the following - Lab report should be in your github page

1. Read Chapter 9 of the book on [Association Rule Mining](https://cran.r-project.org/doc/contrib/Zhao_R_and_data_mining.pdf)
(You can also read [these slides](http://www.slideshare.net/rdatamining/association-rule-mining-with-r ))

2. Read about the [background on Association Rule mining](https://en.wikipedia.org/wiki/Association_rule_learning)

    *hint In RStudio, go to Tools -> Install Packages, then type arules into the "Packages" box, hit ok and do the same thing with arulesViz*

3. Implement association rules for Titanic Data set (experiment with different parameters. Look in chapter 9 of the book on page 89 for support and confidence )

4. Try different visulaizations as done in chapter 9 of the text book. (Things have changed with R too - To load RGraphviz  go to a new Rscript window and type  `source("http://bioconductor.org/biocLite.R")`   Next, type in `biocLite("Rgraphviz")` After this you will be able to plot the graph of rules.)

5. (optional) Read the kaggle [R tutorial on Machine Learning](https://www.datacamp.com/courses/kaggle-tutorial-on-machine-learing-the-sinking-of-the-titanic) (Random forest is also discussed in chapter 4 of the Zhao's book)
(you can login with your facebook or google plus account or register)

6.  Write a paragraph description of the status of your project - What did you do last week on your project? You only have 4 more weeks to finish your project.
