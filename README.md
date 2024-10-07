# Bulgarian Cost Counters

Този проект е калкулатор за загубите коите всеки български гражданин търпи поради
няколко примера за корупция на управляващи политици.

Посетете [https://miroj.github.io/bulgarian-cost-counters/](https://miroj.github.io/bulgarian-cost-counters/),
за да видите основната страница с различни броячи и информация.

Сега работим по създаването на уиджет и скоро ще можете да добавите един или повече
от тези борячи на ваш уебсайт.

---

Информацията в тази страница е базирана на публични данни. До всяко твърдение на страницата
стои и линк към източник с подробности. Не се притеснявайте да проверите информацията сами,
и ако е вярна - да я споделите с хора които биха имали полза да я знаят.

Ако искате детайлна информация за това как са изчислени сумите, моля свържете се с мен.

## Публикуване (Build and Publish)

Преди да започнете с публикуването, уверете се че имате `angular-cli-ghpages` NPM пакет инсталиран
на компютъра в глобалния NPM кеш. Ако го нямате, изпълнете

    npm install -g angular-cli-ghpages

За да публикувате този проект в GitHub Pages, използвайте клона `gh-pages` по следния начин:

    git checkout -b gh-pages
    git push origin gh-pages
    ng build --prod --base-href https://miroj.github.io/bulgarian-cost-counters/
    ngh --dir=dist/bulgarian-cost-counters/browser

След няколко секунди, апликацията трябва да е инсталирана на https://miroj.github.io/bulgarian-cost-counters/.

Успех!
