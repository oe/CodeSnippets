Ext.Loader.setPath({
    'Ext': 'src'
});
Ext.application({
    name: 'contacts',
    requires: [
        'Ext.MessageBox',
        'Ext.data.Store',
        'Ext.List',
        'Ext.plugin.PullRefresh'
    ],
    launch: function() {
        var tabPanel = Ext.create('Ext.TabPanel',{
            fullscreen: true,
            tabBarPosition: 'bottom',
            items: [
            {
                title: 'Group',
                iconCls: 'team',
                html: 'Groups',
                items: [
                {

                }
                ]
            },
            {
                title: 'Contacts',
                iconCls: 'user',
                html: 'users',
                items: [
                {

                }
                ]
            },
            {
                title: 'Favors',
                iconCls: 'star',
                html: 'Favors',
                items: [
                {
                    
                }
                ],
            }
            ],
            listeners: {
                activeitemchange: function  ( me, value, oldValue, eOpts ) {
                    titleBar.setTitle('over');
                    console.log(arguments);
                }
            }
        }),
        titleBar = Ext.create('Ext.TitleBar',{
            docked: 'top',
            title: 'Address Book',
        });
        Ext.Viewport.add([titleBar,tabPanel]);
        // var listConfiguration = this.getListConfiguration();
        // if (!Ext.os.is.Phone) {
        //     Ext.Viewport.add({
        //         xtype: 'panel',
        //         layout: 'fit',
        //         items: [listConfiguration]
        //     });
        // } else {
        //     Ext.Viewport.add(listConfiguration);
        // }
    }//,
    // getListConfiguration: function() {
    //     var store = Ext.create('Ext.data.Store', {
    //         fields: ['firstName', 'lastName'],
    //         sorters: 'firstName',
    //         autoLoad: true,
    //         grouper: {
    //             groupFn: function(record) {
    //                 return record.get('firstName')[0];
    //             }
    //         },
    //         proxy: {
    //             type: 'ajax',
    //             url: 'contacts.json'
    //         }
    //     });

    //     return {
    //         xtype: 'list',

    //         id: 'list',
    //         itemTpl: '{firstName} {lastName}',
    //         // disclosure: true,
    //         grouped: true,
    //         indexBar: true,

    //         // infinite: true,

    //         useSimpleItems: true,

    //         variableHeights: true,

    //         striped: true,

    //         // ui: 'round',
    //         onItemDisclosure: function(record, item, index, e) {
    //             e.stopEvent();
    //             Ext.Msg.alert('Disclose', 'Disclose more info for ' + record.get('firstName'));
    //         },
    //         store: store
    //     };
    // }
});
