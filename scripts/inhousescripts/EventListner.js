
$(document).ready(function () {
  attachEventOnElement()
});

function attachEventOnElement () {
  $('body').on('click', '.grid-cell', gridCellClicked);
}