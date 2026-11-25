# juliencegarra.github.io

Site personnel, écrit en HTML statique sans dépendance. Les textes et les publications choisies sont dans
`content.mjs`, la photo dans `static/photo.jpg`.

    node build.mjs            # interroge HAL et construit le site dans _site/
    node build.mjs --offline  # construit avec la copie locale des notices

## Le composant `<hal-publications>`

Il affiche les publications d'un chercheur ou d'une collection HAL, avec filtres et recherche, dans n'importe quelle
page. Copier `static/hal.js` et `static/hal.css`, puis :

    <link rel="stylesheet" href="hal.css">
    <script src="hal.js" defer></script>
    <hal-publications idhal="juliencegarra" highlight="Julien Cegarra" lang="en"></hal-publications>

| Attribut | Rôle |
|---|---|
| `idhal` ou `collection` | chercheur (`juliencegarra`) ou collection (`INUC-SCOTE`) |
| `lang` | `en` ou `fr` ; par défaut la langue de la page |
| `highlight` | nom complet à mettre en valeur |
| `limit` | n'affiche que les n plus récentes, sans filtres |

Options facultatives, en JSON dans l'élément : `extra` (notices à ajouter), `hidden` (identifiants à masquer),
`aliases` (noms à corriger).

    <hal-publications idhal="juliencegarra">
      <script type="application/json">{"hidden": ["hal-00000000"]}</script>
    </hal-publications>

La police vient de la page. Les couleurs se règlent avec les variables CSS `--fg`, `--muted`, `--link` et `--aside`.
Les doubles dépôts (même DOI, ou mêmes titre, type, année et support) sont fusionnés.
