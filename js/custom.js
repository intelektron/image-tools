function Fraction() {}
Fraction.prototype.convert = function(x, improper)
{
    improper = improper || false;
    var abs = Math.abs(x);
    this.sign = x/abs;
    x = abs;
    var stack = 0;
    this.whole = !improper ? Math.floor(x) : 0;
    var fractional = !improper ? x-this.whole : abs;
    /*recursive function that transforms the fraction*/
    function recurs(x){
        stack++;
        var intgr = Math.floor(x); //get the integer part of the number
        var dec = (x - intgr); //get the decimal part of the number
        if(dec < 0.0019 || stack > 20) return [intgr,1]; //return the last interger you divided by
        var num = recurs(1/dec); //call the function again with the inverted decimal part
        return[intgr*num[0]+num[1],num[0]]
    }
    var t = recurs(fractional); 
    this.numerator = t[0];
    this.denominator = t[1];
}

Fraction.prototype.toString = function()
{
    var l  = this.sign.toString().length;
    var sign = l === 2 ? '-' : '';
    var whole = this.whole !== 0 ? this.sign*this.whole+' ': sign;
    return whole+this.numerator+'/'+this.denominator;
}

$(document).ready(function() {
    $('input[type=text]').keyup(function(){
        inChange(this);
    });
    
    $('#presets a').click(function() {
        $('#width').val($(this).attr('data-width'));
        $('#height').val($(this).attr('data-height'));
        inChange($('#width'));
    });
});

inChange(null);

function megapixels(width, height)
{
    var mp = width * height / 100000;
    return Math.round(mp) / 10;
}

function inChange(element)
{
    var in_width = parseInt($('#width').val());
    var in_height = parseInt($('#height').val());
    var out_width = parseInt($('#new-width').val());
    var out_height = parseInt($('#new-height').val());
        
    if ((in_width > 0) && (in_height > 0)) {
        $('#new-height').removeAttr('disabled');
        $('#new-width').removeAttr('disabled');
        
        // Update sizes
        if (element) {
            if ($(element).attr('id') == 'new-width') {
                var newval = Math.round((in_height * out_width) / in_width);
                if (!isNaN(newval)) {
                    $('#new-height').val(newval);
                    $('#percentage').html('<strong>' + Math.round((out_width / in_width) * 100) + '%</strong> of original image');
                    $('#megapixels-out').html('<strong>' + megapixels(out_width, newval) + ' megapixels</strong> in output image');
                } else {
                    $('#new-height').val('');
                    $('#percentage').html('');
                    $('#megapixels-out').html('');
                }
            } else if ($(element).attr('id') == 'new-height') {
                var newval = Math.round((in_width * out_height) / in_height);
                if (!isNaN(newval)) {
                    $('#new-width').val(newval);
                    $('#percentage').html('<strong>' + Math.round((out_height / in_height) * 100) + '%</strong> of original image');
                    $('#megapixels-out').html('<strong>' + megapixels(out_height, newval) + ' megapixels</strong> in output image');
                } else {
                    $('#new-width').val('');
                    $('#percentage').html('');
                    $('#megapixels-out').html('');
                }
            } else {
                $('#new-width').val('');
                $('#new-height').val('');
                $('#percentage').html('');
                $('#megapixels-out').html('');
                $('#megapixels-in').html('<strong>' + megapixels(in_height, in_width) + ' megapixels</strong> in original image');
            }
        }
        
        // Update aspect ratio
        var aspect = Math.min((in_width, in_height) / Math.max(in_width, in_height));
        if (!isNaN(aspect)) {
            var rounded_aspect = Math.round(aspect * 1000) / 1000;
            var frac = new Fraction()
            frac.convert(aspect, false)
            $('#aspect-ratio').html('<strong>Aspect ratio: </strong>' + rounded_aspect + ' (' + frac.toString() + ')');
        } else {
            $('#aspect-ratio').html('');
        }
        
    } else {
        $('#new-height').attr('disabled', 'disabled');
        $('#new-width').attr('disabled', 'disabled');
        $('#new-width').val('');
        $('#new-height').val('');
        $('#new-height').val('');
        $('#megapixels-out').html('');
        $('#megapixels-in').html('');
        $('#percentage').html('');
        $('#aspect-ratio').html('');
    }
}

//var frac = new Fraction()
//frac.convert(2.56, false)
//console.log(frac.toString())
//use frac.convert(2.56,true) to get it as an improper fraction