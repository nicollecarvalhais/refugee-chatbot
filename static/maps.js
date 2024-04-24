// onload triggers
$(document).ready(function() {
    // Attraction Map Selector
    selectorArea.init();
    mapEngine.init();
});

var selectorArea = (function() {
    var selectorDD = $('#selector'); // the select dropdown
    var selectedOption = selectorDD.find('option:selected').attr('data-selected-value');

    var init = function() {
        // Show initial selected area
        $('.selector-group').hide().filter(
            function() {
                var d = $(this).data('selector');
                return d == selectedOption;
            }
        ).show();
        $(selectorDD).change(function() {
            // updated dropdown
            var newSelectedOption = $(this).find('option:selected').attr('data-selected-value');
            $('.selector-group').hide().filter(
                function() {
                    var d = $(this).data('selector');
                    return d == newSelectedOption;
                }
            ).show();
        });;
    }


    // public
    return {
        init: init
    }
})()

var mapEngine = (function() {

    var init = function() {

            $('.selection-list input[type="radio"]').on('change click', function() {
                $('.pin').removeClass('pin-active'); //clear pins

                var thisLocData = $(this).data('location')
                var thisLocPin = $('.pin[data-location-pin="' + thisLocData + '"]');
                thisLocPin.addClass('pin-active');
                //alert(thisLocPin.data('location-pin'));

            });
            $('.pin').on('change click', function() {
                $('.pin').removeClass('pin-active'); //clear pins
                $(this).addClass('pin-active');

                var thisPinData = $(this).data('location-pin');
                var thisLocation = $('.selection-list input[data-location="' + thisPinData + '"]');

                thisLocation.prop("checked", true);

            });

        }
        // public
    return {
        init: init
    }
})()