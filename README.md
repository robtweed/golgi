# Golgi: Dynamically-loading WebComponent Assembly Framework
 
Rob Tweed <rtweed@mgateway.com>  
14 February 2022, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


# About Golgi

Golgi (pronounced Gol-jee) is a new approach to browser-based UI development that
makes use of the latest Web Technologies, in particular WebComponents, ES6 Modules, Proxies and
MutuationObserver.

This means that Golgi can only be used where you know that the very latest browsers
are in use, but if they are, then it provides one of the fastest and leanest frameworks
for UI development, since it makes use of the built-in capabilities of the browser,
avoiding the need to download large bundled JavaScript framework files.  Golgi itself a mere 25Kb 
in size in its uncompressed source version, and just 10Kb if you use the minimised version,
and is literally all that is needed to make everything work!

Golgi can be used with many other standard UI frameworks such as Bootstrap 5, Chart.js etc. Of
course, if you make use of these, their JavaScript and CSS resource files must be downloaded
into your application.  However, Golgi allows such resources to be downloaded on demand and
only when needed, resulting in very short application load and start times.

Unlike many of the UI frameworks that are currently in vogue, Golgi does not require or make use
of bundling (eg using WebPack etc).  Your JavaScript files and WebComponents that define a Golgi
application are dynamically loaded, on demand, as ES6 Modules.  Avoiding a separate compilation/bundling
step speeds up application development considerably, and doesn't require the creation and configuration
of a complex build chain.  All you need to get up and running is the tiny Golgi JavaScript file, and everything else is done by the Web Technology built into modern browsers.


# Documentation to follow
....


## License

 Copyright (c) 2022 M/Gateway Developments Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
