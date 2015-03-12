
$(document).ready(function () {
  attachEventOnElement();
  $('body').on('click','#show-hide-product-relevance',function(){$('.table-wrapper').toggle();});
});

function attachEventOnElement () {
  $('body').on('click', '.grid-cell', gridCellClicked);
  $('#clear-session-data').on('click', clearSessionAndReloadScreen)
}