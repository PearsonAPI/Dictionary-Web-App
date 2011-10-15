/**
 * jQuery.hasAttr
 * Copyright (c) 2011 Brian Martin - brianm at eystudios dot com | http://www.eystudios.com/brianprofile.html
 * Dual licensed under MIT and GPL.
 * Date: 8/10/2011
 *
 * @projectDescription Uses core jQuery methods to return wheter or not the attribute exists on the selected item
 * Homepage: http://www.eystudios.com
 * Requires jQuery 1.6.2 or higher
 *
 * @author Brian Martin
 * @version 1.0.0
 *
 * @id jQuery.hasAttr
 * @param {String} attribute Name of the attribute to test if it is defined
 *
 * Notes:
 *	-Supports all selectors in the core jQuery Library
 */

(function($){
	 
    $.fn.extend({ 
         
        hasAttr: function(attribute) {
	    	
			if (typeof $(this).attr(attribute) === 'undefined') {
				return false;
			} else {
				return true;
			}
            
        }
    });
     
})(jQuery);