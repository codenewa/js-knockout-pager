(function(ko, datacontext){
	datacontext.Pager = Pager;
    function Pager(options) {
        var self = this;
        options = options || {};
        self.PageSize = ko.observable(options.PageSize);
        self.CurrentPage = ko.observable(1);
        self.TotalCount = ko.observable(0);
        self.Call = options.Call;
        self.Params = ko.observable(options.params);
        self.onDone = options.OnDone;
        self.onError = options.OnError;
        self.SortBy = ko.observable(options.SortBy);
        self.SortOrder = ko.observable(options.SortOrder);
        self.ErrorObservable = options.ErrorObservable;

        self.UpdateParams = function (newParams) {
            self.Params(newParams);
        };

        self.TotalPages = ko.computed(function () {
            return parseInt(Math.ceil(self.TotalCount() / self.PageSize()));
        });
        self.HasNextPage = ko.computed(function () {
            return self.CurrentPage() < self.TotalPages();
        });
        self.HasPrevPage = ko.computed(function () {
            return self.CurrentPage() > 1;
        });
        self.IsLastPage = ko.computed(function () {
            return self.CurrentPage() == self.TotalPages();
        });
        self.IsFirstPage = ko.computed(function () {
            return self.CurrentPage() == 1;
        });

        self.Process = function () {
            self.ServerActionInProcess = true;
            self.Params().pageNum = self.CurrentPage();
            self.Params().pageSize = self.PageSize();
            self.Params().sortBy = self.SortBy();
            self.Params().sortOrder = self.SortOrder();

            self.Call(self.Params())
                .done(function (data) {
                    self.onDone(data);
                }).error(function (data) {
                    //data = data.d ? data.d : data;
                    self.ErrorObservable(new datacontext.Exception(data));
                }).always(function () {
                    self.ServerActionInProcess = false;
                });
        };


        self.NextPage = function () {
            if (!self.IsLastPage()) {
                self.CurrentPage(self.CurrentPage() + 1);
                self.Process();
            }
        };

        self.LastPage = function () {
            if (!self.IsLastPage()) {
                self.CurrentPage(self.TotalPages());
                self.Process();
            }
        };
        self.PrevPage = function () {
            if (!self.IsFirstPage()) {
                self.CurrentPage(self.CurrentPage() - 1);
                self.Process();
            }
        };
        self.FirstPage = function () {
            if (!self.IsFirstPage()) {
                self.CurrentPage(1);
                self.Process();
            }
        };

        self.Load = function () {
            self.Process();
        };

        self.SortClass = function (param) {
            if (param == self.SortBy()) {
                if (self.SortOrder() == 'ASC') {
                    return "ui-icon ui-icon-carat-1-n";
                } else if (self.SortOrder() == 'DSC') {
                    return "ui-icon ui-icon-carat-1-s";
                } else {
                    return "";
                }
            } else {
                return "";
            }
        };

        self.SetSort = function (param) {
            if (param == self.SortBy()) {
                if (self.SortOrder() == 'ASC')
                    self.SortOrder('DSC');
                else
                    self.SortOrder('ASC');
            } else {
                self.SortBy(param);
                self.SortOrder('ASC');
            }
            self.Process();
        };

        self.IsCurrentPageSize = function (param) {
            return param == self.PageSize();
        };

        self.PageSizeClass = function (param) {
            if (self.IsCurrentPageSize(param))
                return "activePageCount";
            else
                return "";
        };

        self.PageSize.subscribe(function () {
            self.CurrentPage(1);
            self.Load();
        });

        return self;
    }
})(ko, demo.datacontext);