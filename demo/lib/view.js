window.demo.view = function(ko, datacontext){
	var self = this;

	self.Pager = ko.observable(new datacontext.Pager(
    {
        'params': self.GetWIPParams(),
        'PageSize': 15,
        'Call': datacontext.GetData,
        'OnDone': self.OnLoad,
        'OnError': self.OnError,
        'SortBy': 'Column1',
        'SortOrder': 'DSC',
        'ErrorObservable': self.Error
    }));

    self.GetData = function(){
    	self.Pager().UpdateParams(self.GetParams());
    	self.Pager().Load();
    };

    self.GetData();

	return self;
};