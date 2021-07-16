+++
showonlyimage = true
draft = false
frontpage = true
image = "img/portfolio/chivaxbot.png"
date = "2020-12-01"
title = "ChiVaxBot"
weight = 1
+++

Which Chicagoans are getting vaccinated? A viral Twitter bot for _South Side Weekly_

<!--more-->

***

![The Twitter header of @ChiVaxBot](/img/portfolio/chivaxbot-header.jpeg)

Every day [@ChiVaxBot](https://twitter.com/ChiVaxBot) pulls in new data from the city of Chicago and generates two maps: one showing Covid-19 deaths in Chicago, and the other showing vaccinations.

![A tweet from ChiVaxBot](/img/portfolio/chivaxbot-2.png)

I developed this with [Charmaine Runes](https://twitter.com/maerunes) for South Side Weekly as a way to track vaccine access and disparity on a hyperlocal, daily scale. We wrote up an explanation of this work [here](https://southsideweekly.com/chivaxbot/).

![A gif of Covid-19 vaccinations in Chicago produced by ChiVaxBot](/img/portfolio/chivaxbot.gif)

This was an experiment in SVG generation for me, and I'm quite pleased with the string manipulation method we landed on for generating lightweight images and a gif. The code for this project is open source [here](https://github.com/beamalsky/chivaxbot).