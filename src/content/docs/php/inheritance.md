---
title: L'héritage
lastUpdated: 2024-05-05
description: Un guide sur l'héritage en PHP.
sidebar:
    order: 1
    label: Héritage
---

:::note[Documentation]
[Héritage](https://www.php.net/manual/fr/language.oop5.inheritance.php) <br>
[Constructeur / parent::](https://www.php.net/manual/fr/language.oop5.decon.php)
:::

## Introduction

L'héritage est un principe fondamental de la programmation orientée objet qui permet à une classe de dériver des propriétés et des méthodes d'une autre classe. En PHP, cela est réalisé en utilisant les mots-clés `extends` et `parent`. Cette approche permet de construire des hiérarchies de classes et de promouvoir la réutilisation du code.


## Quand l'utiliser ?

L’héritage est approprié lorsque vous avez une relation claire deux classes, lorsque vous pouvez dire « c’est un ». Par exemple, une classe de voiture pourrait hériter d’une classe de véhicule. C’est parce qu’une voiture est un véhicule. Ou encore un administrateur est utilisateur.
L'héritage est particulièrement utile quand on souhaite:
- Étendre la fonctionnalité d'une classe existante sans la modifier.
- Implémenter des comportements polymorphiques où des objets de différentes classes peuvent être traités de manière interchangeable.

```php title="Exemple"
class Animal {
    public $nom;
    public $age;

    public function __construct($nom, $age) {
        $this->nom = $nom;
        $this->age = $age;
    }

    public function manger() {
        echo $this->nom . " est en train de manger.";
    }
}

class Oiseau extends Animal {
    public function voler() {
        echo $this->nom . " est en train de voler.";
    }
}

class Mammifère extends Animal {
    public function courir() {
        echo $this->nom . " est en train de courir.";
    }
}
```

Supposons que vous développiez un système pour gérer un zoo. Vous pourriez avoir une classe de base `Animal` et plusieurs sous-classes telles que `Oiseau` et `Mammifère`.

Le mot clé `parent` en PHP est utilisé pour faire référence à des méthodes ou des propriétés de la classe parente dans une classe dérivée. Il est particulièrement utile lors de l'override (réécriture) de méthodes : il permet d'appeler la version de la méthode de la classe parente. Voici comment vous pouvez utiliser `parent` dans un contexte d'héritage :

```php title="Exemple d'utilisation de parent"
class Voiture {
    public function demarrer() {
        echo "Le moteur de la voiture démarre";
    }
}

class VoitureElectrique extends Voiture {
    public function demarrer() {
        parent::demarrer(); // Appelle la méthode demarrer de la classe parente
        echo " Le système électrique est activé";
    }
}

$maVoiture = new VoitureElectrique();
$maVoiture->demarrer();
```

Dans cet exemple, lorsque vous appelez la méthode `demarrer` sur un objet de la classe `VoitureElectrique`, elle exécutera d'abord la méthode `demarrer` de sa classe parente `Voiture` grâce à l'utilisation de `parent::demarrer()`, puis ajoutera son propre comportement supplémentaire.

## Avantages de l'héritage

- Réutilisation du code : L'héritage permet de réutiliser le code de la classe de base, évitant ainsi la duplication.
- Polymorphisme : Permet aux classes dérivées de traiter ou de redéfinir les méthodes de leur classe parent, ce qui facilite la maintenance et l'évolution du code.

```php title="Modification des comportements d'un animal"
$perroquet = new Oiseau('Paco', 5);
$perroquet->manger();  // Hérite de la classe Animal
$perroquet->voler();   // Comportement spécifique à Oiseau

$tigre = new Mammifère('Tigrou', 3);
$tigre->manger();  // Hérite de la classe Animal
$tigre->courir();  // Comportement spécifique à Mammifère
```

## Limitations de l'héritage

- Fragilité des architectures : Les modifications dans la classe de base peuvent affecter toutes les sous-classes.
- Surcharge : Les sous-classes peuvent hériter de plus de fonctionnalités qu’elles n’en nécessitent.
- Problèmes de conception : L'héritage peut conduire à une mauvaise conception si mal utilisé, en particulier en créant des dépendances rigides entre les classes.

## Conclusion 

Bien que l'héritage soit un outil puissant en programmation orientée objet, il doit être utilisé judicieusement pour éviter de complexifier inutilement la structure du code. Dans de nombreux cas, la composition peut être une alternative plus flexible et moins contraignante.