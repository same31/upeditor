CodeFest Toulouse: boilerplate
===================


Bienvenue au codefest toulouse. Ceci est notre boilerplate basé sur ReactJS. Il vous permettra d'avoir une base de développement pour réaliser au mieux l'épreuve qui vous a été assignée.

----------


Comment démarrer le boilerplate
-------------

La première étape est de cloner ce boilerplate sur votre ordinateur (sans déééééc). Puis d'installer tous les packages npm en tapant la commande suivante:

    npm install
Ensuite, démarrez simplement l'appli

    npm start
Il est possible d'utiliser yarn si vous préférez

<i class="icon-list"></i> Structure de l'application
-------------

Notre boilerplate est structuré de la facon suivante:

    boilerplate/
	 node_modules/
	   package.json
	 public/
	   index.html
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
	         YourComponent/
		        package.json
	  .babelrc
	  package.json
	  README.md


<i class="icon-github"></i> Developpement
-------------

Un dossier YourComponent est présent dans le dossier /src/components. c'est juste un indication d'où placer votre composant afin que le jury puisse le retrouver simplement. Vous pouvez le nommer TheCodeFestTeamRocks si vous le souhaitez aussi.

La facon la plus facile pour tout le monde d'organiser son projet serait de créer entièrement votre composant dans ce dossier de dev et d'en importer le rendu/index dans le fichier App se trouvant à la racine du dossier /src.

Un fichier pakage.json est également présent. N'oubliez pas d'y mettre les dépendences requises pour votre composant à chaque fois que vous en ajoutez une au boilerplate. cela nous permettra lors de l'intégration de savoir quelles sont les dépendances utilisées.


<i class="icon-code"></i> Github
-------------

Un repo github est mis à la disposition de votre équipe (celui-ci oui). N'oubliez pas de push votre code régulièrement afin qu'on puisse suivre votre évolution, testez vos fonctionnalités et ainsi répondre à vos questions, si vous en avez évidemment.

Si tout le monde suit cette hierarchie, on gagnera un temps foufou :)

Allé, Enjoy React, enjoy the code et bonne chance à tous.

N'héistez pas à nous poser des questions, on est là pour ça.
