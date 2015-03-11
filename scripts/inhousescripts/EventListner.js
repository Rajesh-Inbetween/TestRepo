
$(document).ready(function () {
  attachEventOnElement();
console.log(123);
  $('body').on('click','#show-hide-product-relevance',function(){$('.table-wrapper').toggle();});
});

function attachEventOnElement () {
  $('body').on('click', '.grid-cell', gridCellClicked);
}