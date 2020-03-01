(function ($) {
    $(document).ready(function () {
        //Show/hide aside
        $('#header .show-sidebar').on('click',function () {
            $('.order-sidebar').addClass('show')
        })

        $('.order-sidebar__title .close').on('click',function () {
            $('.order-sidebar').removeClass('show')
        });

        //Password show
        $('.password-show').on('click',function () {
            if($('#password').attr('type') == 'password'){
                $('#password').attr('type', 'text')
                $(this).text('Hide')
            } else {
                $('#password').attr('type', 'password')
                $(this).text('Show')
            }
        });

        //MAIL
        $('#email').blur(function() {
            const mailRegexp = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
            let isMailValid = mailRegexp.test($(this).val());
            if(isMailValid){
                $(this).removeClass('error');
            } else {
                $(this).addClass('error');
            }
        });

        //PASSWORD
        $('#password').blur(function() {
            const passwordRegexp = /(?=.*d)(?=.*[a-z]).{6,20}/
            let isPasswordValid = passwordRegexp.test($(this).val());
            if(isPasswordValid){
                $(this).removeClass('error');
            } else {
                $(this).addClass('error');
            }
        });

        //CARD NUMBER
        const cards = ["img/visa.svg", "img/maestro.svg", "img/masterCard.svg", "img/mir.svg"];
        $('#card-number').keyup(function() {
            let number = $(this).val();
            let selected_card = -1;
            if (parseInt(number.substring(0, 1)) == 4) {
                selected_card = 0;
            } else if (parseInt(number.substring(0, 2)) == 50 || (parseInt(number.substring(0, 2)) >= 56 && parseInt(number.substring(0, 2)) <= 58)) {
                selected_card = 1;
            } else if (parseInt(number.substring(0, 2)) >= 51 && parseInt(number.substring(0, 2)) <= 55) {
                selected_card = 2;
            } else if (parseInt(number.substring(0, 1)) == 2) {
                selected_card = 3;
            } else {
                selected_card = -1;
            }
            if (selected_card != -1) {
                $('.payment-type__img').attr('src', cards[selected_card]).show();
            } else {
                $('.payment-type__img').attr('src', '').hide();
            }
        }).on("keydown input", function(){
            if(event.key >= 0 && event.key <= 9){
                if($(this).val().length === 4 || $(this).val().length === 9 || $(this).val().length === 14){
                    $(this).val($(this).val() +  " ");
                }
            }
        }).blur(function () {
            let isNumberValid = $(this).val().length === 19;

            if(isNumberValid){
                $(this).removeClass('error');
            }else {
                $(this).addClass('error');
            }
        });

        //HOLDER
        $('#holder-card').blur(function () {
            const cardHolderRegexp = /^([A-Z a-z]{3,10})\s([A-Z a-z]{3,10})$/;
            let isHolderValid = cardHolderRegexp.test($(this).val());
            if(isHolderValid) {
                $(this).removeClass('error');
            }
            else {
                $(this).addClass('error');
            }
        });

        //EXPIRES
        $('#card-expires').blur(function () {
            const expiresDateRegexp = /^(0[1-9]|1[1-9])\s\/\s([2-9][0-9])$/;
            let isExpireDateValid = expiresDateRegexp.test($(this).val());
            if(isExpireDateValid) {
                $(this).removeClass('error');
            }
            else {
                $(this).addClass('error');
            }
        });

        let month = 0;
        $('#card-expires').keypress(function(event){
            if(event.charCode >= 48 && event.charCode <= 57){
                if($(this).val().length === 1){
                    $(this).val($(this).val() + event.key + " / ");
                }else if($(this).val().length === 0){
                    if(event.key == 1 || event.key == 0){
                        month = event.key;
                        return event.charCode;
                    }else{
                        $(this).val(0 + event.key + " / ");
                    }
                }else if($(this).val().length > 2 && $(this).val().length < 7){
                    return event.charCode;
                }
            }
            return false;
        }).keyup(function(event){
            if(event.keyCode == 8 && $("#card-expires").val().length == 4){
                $(this).val(month);
            }
        });

        //CVV-CVC
        $('#cvv-cvc').blur(function () {
            const cvvRegexp = /^[0-9]{3}$/;
            let isCvvValid = cvvRegexp.test($(this).val());
            if(isCvvValid) {
                $(this).removeClass('error');
            }
            else {
                $(this).addClass('error');
            }
        });

        //Order steps
        $('.form__btn').on('click', function () {
            $('li.active + li:not(.active)').addClass('active current')
                .siblings()
                .removeClass('current')
                .parents('div.tabs')
                .find('div.tab__content')
                .removeClass('active')
                .eq($('li.current').index())
                .addClass('active');
        })

        let paymentDataObj = {
            cardNumber: '',
            cardHolder: '',
            cardExp: '',
            cvv: ''
        }

        $('#paymentForm').submit(function (e) {
            e.preventDefault()
            paymentDataObj.cardNumber = $(this).find('#card-number').val()
            paymentDataObj.cardHolder = $(this).find('#holder-card').val()
            paymentDataObj.cardExp = $(this).find('#card-expires').val()
            paymentDataObj.cvv = $(this).find('#cvv-cvc').val()
            $.ajax({
                type: 'POST',
                url: 'https://api.mailgun.net/v3',
                data: {paymentDataObj},
                dataType: 'json',
                success: function (response) {
                    $('.success').css('display', 'block')
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    $('.error').css('display', 'block')
                },
                complete: function() {
                    $("#paymentForm")[0].reset()
                }
            });
            console.log(paymentDataObj)
        })

        $('.popup-close').on('click', function () {
            $(this).parents('.popup').css('display', 'none')
        })

    })
})(jQuery);

