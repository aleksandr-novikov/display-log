# Display.log

Display.log mirrors your console messages over the page.

Can be useful for debugging on mobile phones or if you want to save some screen space by keeping developer console closed.

![Screenshot](/screen.png)

## Usage

Paste the following code snippet after the body tag of your page.

```html
<script src="https://cdn.jsdelivr.net/gh/aleksandr-novikov/display-log@1.1.0/dist/displaylog.min.js"></script>
<script> displayLog.init(); </script>
```

## API

### displayLog.init([settings])

Initializes display logger and puts panel on the page.

#### settings object
| Property  	| Type   	| Default              	| Description                  	|
|-----------	|--------	|----------------------	|------------------------------	|
| bgColor   	| string 	| 'rgba(0, 0, 0, 0.4)' 	| Panel background color       	|
| textColor 	| string 	| '#fff'               	| Color of text messages       	|
| fontStyle  	| string 	| 'Courier New'         | Font style                   	|
| fontSize  	| string 	| '1em'                	| Font size                    	|
| padding   	| string 	| '0.5vw'              	| Padding of text messages     	|
| maxHeight 	| string 	| '30vh'               	| Maximum console height       	|
| closable  	| bool   	| true                 	| Panel can be closed be click 	|

## License

Copyright (c) 2019 Aleksandr Novikov. [License](./LICENSE).
