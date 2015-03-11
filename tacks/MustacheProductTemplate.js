var sMustacheSmallTemplate =
    "<div class='product_template_data'>"+


    //"<div class='product_template_label'>{{label}}</div>" +
    //"<div class='product_template_content'>{{content}}</div>" +

      "<div class='product_template_container'>"+

        //"<div class='small_product-data-details'>" +
        "<div class='product-label small_product_template_label_info'>{{label}}</div>" +
        //"</div>"+

        "<div class='product_data_image'>"+
          "<div class='product_template small_product_template' data-id='{{id}}' data-content='{{content}}' style='background-image: url(\"{{image}}\")'></div>" +
          //"<div class='product_template_description'>{{description}}</div> " +
        "</div>" +

        "<div class='product-content small_product_template_content_info'>{{content}}</div>" +

      "</div>" +

    "</div>";

var sMustacheLargeTemplate =
    "<div class='product_template_data'>"+

    //"<div class='product_template_label'>{{label}}</div>" +
    //"<div class='product_template_content'>{{content}}</div>" +

      "<div class='product_template_container'>"+

        "<div class='product-data-details'>" +
          "<div class='product-label large_product_template_label_info'>{{label}}</div>" +
          "<div class='product-content large_product_template_content_info'>{{content}}</div>" +
        "</div>"+

        "<div class='product_data_image'>"+
          "<div class='product_template large_product_template' data-id='{{id}}' data-content='{{content}}' style='background-image: url(\"{{image}}\")'></div>" +
          //"<div class='product_template_description'>{{description}}</div> " +
        "</div>" +

      "</div>"+

    "</div>";
