
/**
 * SpagoBI - The Business Intelligence Free Platform
 *
 * Copyright (C) 2004 - 2008 Engineering Ingegneria Informatica S.p.A.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * 
 **/
 

/**
  * Object name 
  * 
  * [description]
  * 
  * 
  * Public Properties
  * 
  * [list]
  * 
  * 
  * Public Methods
  * 
  *  [list]
  * 
  * 
  * Public Events
  * 
  *  [list]
  * 
  * Authors
  * 
  * - Chiara Chiarelli (chiara.chiarelli@eng.it)
  */

Ext.ns("Sbi.widgets");

Sbi.widgets.FilterLookupField = function(config) {
	
	Ext.apply(this, config);
	
	this.config = config;
	this.store = config.store;

	this.addEvents('selectionmade');

	this.store.baseParams  = config.params;
	this.params = config.params;

	this.win = null;
	
	//this.initWin();
	this.init();
	
	var c = Ext.apply({}, config, {
		triggerClass: 'x-form-search-trigger'
		, enableKeyEvents: true
		,  width: 150
	});   
	
	// constructor
	Sbi.widgets.FilterLookupField.superclass.constructor.call(this, c);
	
	this.on("render", function(field) {
		field.trigger.on("click", function(e) {
			this.onLookUp(); 
		}, this);
	}, this);
	
	this.on("render", function(field) {
		field.el.on("keyup", function(e) {
			this.xdirty = true;
		}, this);
	}, this);
	
	this.win.on("selectionmade", this.setValue,this);
	
	/*
	this.grid.on('render', function(g) {
		alert('DONE');
		g.getView().on( 'beforerefresh', function(){ alert('beforerefresh'); } );
		g.getView().on( 'refresh', function(){ alert('refresh'); } );
	});
	*/
	
	
	
};

Ext.extend(Sbi.widgets.FilterLookupField, Ext.form.TriggerField, {
    
	// ----------------------------------------------------------------------------------------
	// members
	// ----------------------------------------------------------------------------------------
    
	// STATE MEMBERS
	  valueField: null
    
    // oggetto (value: description, *)
    , xvalue: null
    // oggetto (value: description, *)
    , xdirty: false
    
    , singleSelect: true
    
    , paging: true
    , start: 0 
    , limit: 20
    
	// SUB-COMPONENTS MEMBERS
	, store: null
    , win: null
    
    // default separator for lookup values
    , valuesSeparator: ';'
       
   
    // ----------------------------------------------------------------------------------------
    // public methods
	// ----------------------------------------------------------------------------------------
    
    
    , getValue : function(){
    
		this.clean();
		var v = [];
		this.xvalue = this.xvalue || {};
		for(p in this.xvalue) {
			v.push(p);
		}
			
		if(this.singleSelect === true) {
			v = (v.length > 0)? v[0] : '';
		}
		
		return v;
	}

	
    
    // private methods
    , init: function() {
    	this.win = new Sbi.widgets.FilterLookupPopupWindow(this.config);   
    }


    
    
	, setValue : function(v){	
		if(typeof v === 'object') {
			this.xvalue = {};
			
			if(v instanceof Array) {
				var t = {};
				for(var i = 0; i < v.length; i++) {
					t[ v[i] ] = v[i];
				}
				v = t;
			}
			
			Ext.apply(this.xvalue, v);
			var displayText = '';
			for(p in this.xvalue) {
				displayText += this.xvalue[p] + ';';
			}	
			if(this.singleSelect === true) {
				displayText = displayText.substr(0, displayText.length-1);
			}
			Sbi.widgets.FilterLookupField.superclass.setValue.call(this, displayText);
		} else {
			this.xvalue = {};
			this.xvalue[v] = v;
			Sbi.widgets.FilterLookupField.superclass.setValue.call(this, v);
		}
		this.fireEvent('selectionmade', v);	
	}

	
    , clean: function() {
    	if (this.xdirty) {
	    	var text = Sbi.widgets.FilterLookupField.superclass.getValue.call(this);
	    	var values = text.split(this.valuesSeparator);
	    	this.xvalue = {};
	    	if(text.trim() === '') return;
	    	var ub = (this.singleSelect === true)? 1 : values.length;
	    	for (var i = 0; i < ub; i++) {
	    		this.xvalue[ '' + values[i] ] = values[i];
	    	}
	    	this.xdirty = false;
    	}
    }
    
	, onLookUp: function(valuesToload) {

		this.clean();
		//this.resetSelection(valuesToload);

		this.win.resetSelection(valuesToload);
		
		this.win.show(this);
		var p = Ext.apply({}, this.params, {
			start: this.start
			, limit: this.limit
		});
		this.store.load({params: p});

	}

});