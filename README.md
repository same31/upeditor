# CodeFest Toulouse: UpEditor

## Equipe: LETOFNI (Infotel)

### Membres de l'equipe:
* Matthieu Mitrani
* Maël Jarnole
* Pablo Operé Portero



## Défi 


Bienvenue sur notre projet qui participe sur le hackathon Code Fest Toulouse sur le défi numéro 2 : [Points clé du défi](https://github.com/carbontracking/codefest/blob/master/D%C3%A9fi_02.md)

Nous avons eu 2 jours pour dévélopper ce projet.



## Comment démarrer le projet


La première étape est d'avoir node et npm sur votre ordinateur, cloner le projet. Puis d'installer tous les packages npm en tapant la commande suivante:

    npm install
Ensuite, démarrez simplement l'appli

    npm start



## Technologies utilisées

* [Boiler plate ReactJS](https://github.com/meteor-intelligence-team/react-boilerplate)
* [Material UI](https://github.com/callemall/material-ui)
* [Tesseract (OCR)](https://github.com/naptha/tesseract.js#tesseractjs)
* Internationalisation (fait maison sur le projet)
* [EventEmitter2](https://github.com/asyncly/EventEmitter2)

 ## Structure du projet:

    upeditor/
	 node_modules/
	   package.json
	 public/
	   index.html
	   codefest_logo.png
	   favicon.ico
	 src/
	   App.css
	   App.js
	   index.css
	   index.js
	   node_modules/
	      components/
	         CodeFest/
		        codefest_logo.png
		        CodeFest.js
	         Editor/
	         	components/
	         		EditorComponent.js
	         	input/
	         		Example_01_deux_colonnes.html
	         	languages/
	         		en-EN.json
	         		es-ES.json
	         		fr-FR.json
	         	EditorApp.js
	         	htmlUtils.js
	         	intl.js
		        package.json
		        style.css
	  .babelrc
	  package.json
	  README.md
