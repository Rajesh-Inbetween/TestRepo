
$(document).ready(function () {
  attachEventOnElement()
});

function attachEventOnElement () {
  $('body').on('.grid-cell', 'click', gridCellClicked);
}