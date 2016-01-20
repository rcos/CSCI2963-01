# Lab 7 Community Development - (un)Leadership Oct 23, 2015

#### Dr. Luis Ibanez talked about community and how people co-operates to contribute to a project
#### In this lab, we will explore this further using automatic tools, software and manually.
> This will be done by groups (each table is a group, if there are less than 3 student, or more than 5, find a new table)  
> All the results should be documented in a labreport7.md and pushed to in your Github account.

1. Project selection -
  - Take five projects from http://rcos.io and clone them locally.
>(table 1 takes the first five, table 2 takes the next 5 and so on - If the last few tables run out of projects, then please take it from the [archive list](http://rcos.rpi.edu/projects/archive_list/) )

  - Write down the number of contributors, number of lines of code and the first and last commit of the project (by hand)
  > To get the lines of a project, try something like `git ls-files -z | xargs -0 wc -l` This requires you clone the project first.

2. Gitstats -
  - Install
    - Clone the project `https://github.com/hoxu/gitstats` locally, and run `make install`
    - gitstats requires gnuplot. To install, run `sudo apt-get install gnuplot-x11`.
  - Running
    - From the command from command line, use  `gitstats <path to project1 git repo> <output path>`
    - You can see the output in a browser by typing `file:///<output path>/index.html` in the address bar
    - You may also be able to open it from the command line using `xdg-open <output path>/index.html` or `sensible-browser <output path>/index.html`

  - Repeat this for each of the five projects.
  - Compare to your results from #1 to these results and comment on your findings.

    > (If you are curious, please read and try to understand the python code  
`https://github.com/hoxu/gitstats/blob/master/gitstats` - Its even better if you suggest some improvements)

3. Streaming Visualization -
  - Read the webpage http://gource.io/.
  - Download gource using `sudo apt-get install gource` .
  - Go to each of the five cloned repository directories and execute the coomand
`gource`
    - You will get a streaming video of the activity in that project.
    - Now, create a youtube video of these projects.
      - Install ffmpeg using `sudo apt-get install ffmpeg` or install avconv using `sudo apt-get install avconv`.
      - Excute the following two commands from each of the cloned repositories:
      ```
      gource -1280x720 -o gource.ppm --time-scale 3
      ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i gource.ppm  -vcodec mpeg4 -b 3000k -s hd480 gource.mp4
       ```
      or
      ```
      gource -1280x720 -o gource.ppm --time-scale 3
      avconv -y -r 60 -f image2pipe -vcodec ppm -i gource.ppm  -vcodec mpeg4 -b 3000k -s hd480 gource.mp4
      ```
      or for a more fun gource:
      ```
      gource -1280x720 -o gource.ppm --auto-skip-seconds 1 --max-files 0 --time-scale 3 --camera-mode track --file-idle-time 0 --bloom-multiplier 1.5  -e 0.5 --title "<Project Title>"
      ```

        > Example youtube videos - [Ruby](https://www.youtube.com/watch?v=si-kxnwKvjU) and  [Observatory (old)](https://www.youtube.com/watch?v=SKArMLw1QY0)  and [CSCI 2961-01 Intro to Open Source](https://youtu.be/-R3-t0oLcpk )

        >Upload your five videos to youtube and provide links. Is there a leader for each of the five projects? Who would you call the leader?

Make sure to include screenshots and comments in your blog post.
