# CalendarMaker
Makes a powerpoint version of a yearly calendar.  

This site makes use of a modified version of [PptxGenJS](https://github.com/gitbrent/PptxGenJS) for powerpoint generation as well as modified portions of [moment-holiday](https://github.com/kodie/moment-holiday) for holiday parsing and calculation.

Events marked with a tag '{est:yyyy}' where 'yyyy' is the 4-digit year, are converted into the ordinal number of years.  For instance, if the calendar is for 2018 and there is a tag for '{est:2016}' within the text, that tag will be converted to '2nd'.

Live example can be found [here](https://gdicristofaro.github.io/CalendarMaker/).
