(function(){
  const STORAGE_KEY='voltdrive_admin_v1';
  const seed={
    platform:{name:'VoltDrive Platform',environment:'Production',region:'Armenia',version:'Admin prototype 1.0 final'},
    admin:{id:'ADM-001',name:'Ani Grigoryan',role:'Platform Administrator',initials:'AG',lastLogin:'Today · 09:42',twoFactor:true},
    currentSession:{userId:'USR-001'},
    companies:[
      {id:'CMP-001',name:'VoltDrive Armenia',legalName:'VoltDrive Armenia LLC',companyType:'Network Operator',registrationNumber:'286.110.12345',taxId:'02861101',countryCode:'AM',country:'Armenia',currency:'AMD',timezone:'Asia/Yerevan',primaryBrand:'VoltDrive',brands:['VoltDrive'],sites:12,users:84,admins:5,billingProfile:'Complete',taxProfile:'VAT 20%',settlementProfile:'Direct operator',paymentProfile:'Ameriabank Gateway',contactEmail:'admin@voltdrive.am',address:'Yerevan, Armenia',status:'active',createdAt:'2025-11-03',lastUpdated:'2026-08-16 18:42'},
      {id:'CMP-002',name:'Ararat Mobility',legalName:'Ararat Mobility CJSC',companyType:'Fleet & Site Operator',registrationNumber:'264.120.40891',taxId:'02641204',countryCode:'AM',country:'Armenia',currency:'AMD',timezone:'Asia/Yerevan',primaryBrand:'Ararat Charge',brands:['Ararat Charge','Ararat Fleet'],sites:7,users:41,admins:3,billingProfile:'Complete',taxProfile:'VAT 20%',settlementProfile:'Revenue share',paymentProfile:'VoltDrive managed',contactEmail:'ops@araratmobility.am',address:'Yerevan, Armenia',status:'active',createdAt:'2026-01-14',lastUpdated:'2026-08-17 08:22'},
      {id:'CMP-003',name:'Sevan Charge',legalName:'Sevan Charge LLC',companyType:'Site Operator',registrationNumber:'295.110.18230',taxId:'02951101',countryCode:'AM',country:'Armenia',currency:'AMD',timezone:'Asia/Yerevan',primaryBrand:'Sevan Charge',brands:['Sevan Charge'],sites:4,users:18,admins:2,billingProfile:'Complete',taxProfile:'VAT 20%',settlementProfile:'Property owner share',paymentProfile:'VoltDrive managed',contactEmail:'admin@sevancharge.am',address:'Gegharkunik, Armenia',status:'active',createdAt:'2026-03-08',lastUpdated:'2026-08-15 15:17'},
      {id:'CMP-004',name:'North Route Energy',legalName:'North Route Energy LLC',companyType:'Network Operator',registrationNumber:'405678912',taxId:'GE-405678912',countryCode:'GE',country:'Georgia',currency:'GEL',timezone:'Asia/Tbilisi',primaryBrand:'North Route',brands:['North Route'],sites:5,users:26,admins:2,billingProfile:'Incomplete',taxProfile:'VAT profile incomplete',settlementProfile:'Roaming + direct',paymentProfile:'Provider review',contactEmail:'platform@nreroute.ge',address:'Tbilisi, Georgia',status:'setup',createdAt:'2026-06-22',lastUpdated:'2026-08-17 09:56'}
    ],
    countries:[
      {code:'AM',name:'Armenia',currency:'AMD',timezone:'Asia/Yerevan',locale:'hy-AM',language:'Armenian',taxProfile:'VAT 20%',invoiceProfile:'Armenia tax invoice',legalTerms:'Armenia driver terms',paymentRegion:'Armenia',marketStatus:'live',status:'active',companies:3,sites:23,lastUpdated:'2026-08-16 18:42'},
      {code:'GE',name:'Georgia',currency:'GEL',timezone:'Asia/Tbilisi',locale:'ka-GE',language:'Georgian',taxProfile:'VAT profile incomplete',invoiceProfile:'Setup required',legalTerms:'Georgia driver terms · draft',paymentRegion:'Georgia',marketStatus:'setup',status:'warning',companies:1,sites:5,lastUpdated:'2026-08-17 09:56'}
    ],
    currencies:[
      {code:'AMD',name:'Armenian Dram',symbol:'֏',decimals:2,rateMode:'Base currency',rateToBase:1,settlement:true,charging:true,status:'active',lastUpdated:'2026-08-17 08:30'},
      {code:'GEL',name:'Georgian Lari',symbol:'₾',decimals:2,rateMode:'Daily provider rate',rateToBase:137.5,settlement:true,charging:true,status:'active',lastUpdated:'2026-08-17 08:30'},
      {code:'USD',name:'US Dollar',symbol:'$',decimals:2,rateMode:'Daily provider rate',rateToBase:387.2,settlement:true,charging:false,status:'active',lastUpdated:'2026-08-17 08:30'},
      {code:'EUR',name:'Euro',symbol:'€',decimals:2,rateMode:'Daily provider rate',rateToBase:452.6,settlement:true,charging:false,status:'active',lastUpdated:'2026-08-17 08:30'}
    ],
    users:{active:169,pendingInvites:5,pendingApprovals:3,without2fa:7,privileged:14},
    userDirectory:[
      {id:'USR-001',name:'Ani Grigoryan',email:'ani.g@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-PLATFORM-ADMIN',scope:'Platform · All companies',accessScope:{level:'platform',companyIds:[],countryCodes:[],siteIds:[],chargerIds:[]},status:'active',twoFactor:true,lastLogin:'Today · 09:42',source:'Internal',createdAt:'2025-11-03'},
      {id:'USR-002',name:'Arman Hakobyan',email:'arman.h@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-COMPANY-ADMIN',scope:'VoltDrive Armenia · All sites',accessScope:{level:'company',companyIds:['CMP-001'],countryCodes:['AM'],siteIds:[],chargerIds:[]},status:'active',twoFactor:true,lastLogin:'Today · 10:08',source:'Internal',createdAt:'2025-12-09'},
      {id:'USR-003',name:'Mane Sargsyan',email:'mane.s@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-OP-SUPERVISOR',scope:'VoltDrive Armenia · Armenia',accessScope:{level:'country',companyIds:['CMP-001'],countryCodes:['AM'],siteIds:[],chargerIds:[]},status:'active',twoFactor:true,lastLogin:'Today · 08:55',source:'Internal',createdAt:'2026-01-17'},
      {id:'USR-004',name:'Gor Petrosyan',email:'gor.p@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-OPERATOR',scope:'VoltDrive Armenia · Yerevan sites',accessScope:{level:'site',companyIds:['CMP-001'],countryCodes:['AM'],siteIds:['ENG-SITE-001','ENG-SITE-002','ENG-SITE-003'],chargerIds:[]},status:'active',twoFactor:true,lastLogin:'Yesterday · 22:31',source:'Internal',createdAt:'2026-02-21'},
      {id:'USR-005',name:'Narek Avetisyan',email:'narek.a@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-FLEET-MANAGER',scope:'VoltDrive Armenia · Corporate fleet',accessScope:{level:'company',companyIds:['CMP-001'],countryCodes:['AM'],siteIds:[],chargerIds:[]},status:'active',twoFactor:true,lastLogin:'Today · 07:12',source:'Internal',createdAt:'2026-03-04'},
      {id:'USR-006',name:'Tigran Martirosyan',email:'tigran.m@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-TECHNICIAN',scope:'VoltDrive Armenia · Yerevan + Kotayk',accessScope:{level:'country',companyIds:['CMP-001'],countryCodes:['AM'],siteIds:[],chargerIds:[]},status:'active',twoFactor:false,lastLogin:'Yesterday · 18:04',source:'Internal',createdAt:'2026-03-18'},
      {id:'USR-007',name:'Lusine Harutyunyan',email:'lusine.h@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-FINANCE',scope:'VoltDrive Armenia · Finance',accessScope:{level:'company',companyIds:['CMP-001'],countryCodes:['AM'],siteIds:[],chargerIds:[]},status:'active',twoFactor:true,lastLogin:'Today · 09:14',source:'Internal',createdAt:'2026-04-02'},
      {id:'USR-008',name:'Sona Mkrtchyan',email:'sona.m@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-SUPPORT',scope:'VoltDrive Armenia · Customer support',accessScope:{level:'company',companyIds:['CMP-001'],countryCodes:['AM'],siteIds:[],chargerIds:[]},status:'active',twoFactor:true,lastLogin:'Today · 10:26',source:'Internal',createdAt:'2026-04-15'},
      {id:'USR-009',name:'Davit Khachatryan',email:'davit.k@araratmobility.am',companyId:'CMP-002',roleId:'ROLE-COMPANY-ADMIN',scope:'Ararat Mobility · All sites',accessScope:{level:'company',companyIds:['CMP-002'],countryCodes:['AM'],siteIds:[],chargerIds:[]},status:'active',twoFactor:true,lastLogin:'Yesterday · 16:20',source:'Company SSO',createdAt:'2026-05-07'},
      {id:'USR-010',name:'Irina Melikyan',email:'irina.m@sevancharge.am',companyId:'CMP-003',roleId:'ROLE-AUDITOR',scope:'Sevan Charge · Read only',accessScope:{level:'company',companyIds:['CMP-003'],countryCodes:['AM'],siteIds:[],chargerIds:[]},status:'active',twoFactor:true,lastLogin:'Aug 15 · 12:11',source:'Internal',createdAt:'2026-05-19'},
      {id:'USR-011',name:'Karen Grigoryan',email:'karen.g@nreroute.ge',companyId:'CMP-004',roleId:'ROLE-COMPANY-ADMIN',scope:'North Route Energy · Georgia',accessScope:{level:'country',companyIds:['CMP-004'],countryCodes:['GE'],siteIds:[],chargerIds:[]},status:'setup',twoFactor:false,lastLogin:'Never',source:'Invitation',createdAt:'2026-08-12'},
      {id:'USR-012',name:'Vahan Simonyan',email:'vahan.s@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-OPERATOR',scope:'VoltDrive Armenia · Gyumri site',accessScope:{level:'site',companyIds:['CMP-001'],countryCodes:['AM'],siteIds:['SITE-GYUMRI'],chargerIds:[]},status:'suspended',twoFactor:true,lastLogin:'Aug 09 · 19:42',source:'Internal',createdAt:'2026-02-09'}
    ],
    permissionCatalog:[
      {group:'Organization',items:[
        {id:'admin.portal.view',label:'Access Admin Portal'},{id:'companies.view',label:'View companies'},{id:'companies.manage',label:'Manage companies'},{id:'users.view',label:'View users'},{id:'users.manage',label:'Manage users'},{id:'roles.manage',label:'Manage roles & permissions'},{id:'markets.view',label:'View countries & currencies'},{id:'markets.manage',label:'Manage countries & currencies'}
      ]},
      {group:'Network Operations',items:[
        {id:'chargers.view',label:'View chargers'},{id:'chargers.remote.restart',label:'Restart chargers remotely'},{id:'chargers.disable',label:'Disable chargers/connectors'},{id:'sessions.view',label:'View charging sessions'},{id:'sessions.force_stop',label:'Force-stop charging sessions'},{id:'reservations.manage',label:'Manage reservations'},{id:'emergency.site_shutdown',label:'Emergency site shutdown'}
      ]},
      {group:'Fleet & Maintenance',items:[
        {id:'fleet.view',label:'View fleet data'},{id:'fleet.manage',label:'Manage fleet charging'},{id:'maintenance.view',label:'View maintenance'},{id:'maintenance.manage',label:'Manage maintenance jobs'},{id:'diagnostics.remote',label:'Run remote diagnostics'}
      ]},
      {group:'Commercial',items:[
        {id:'tariffs.view',label:'View tariffs'},{id:'tariffs.edit',label:'Edit & publish tariffs'},{id:'taxes.view',label:'View tax profiles'},{id:'taxes.manage',label:'Manage tax profiles'},{id:'payments.view',label:'View payments'},{id:'payments.manage',label:'Manage payment configuration'},{id:'payments.refund',label:'Issue refunds'},{id:'accounting.view',label:'View accounting'},{id:'accounting.manage',label:'Manage accounting & ledger mappings'},{id:'settlements.view',label:'View partner settlements'},{id:'settlements.manage',label:'Manage partner settlements'}
      ]},
      {group:'Platform & Security',items:[
        {id:'integrations.view',label:'View integrations'},{id:'integrations.manage',label:'Manage ERP/API integrations'},{id:'roaming.view',label:'View roaming configuration'},{id:'roaming.manage',label:'Manage roaming configuration'},{id:'firmware.view',label:'View firmware campaigns'},{id:'firmware.manage',label:'Manage firmware campaigns'},{id:'security.view',label:'View security & certificates'},{id:'security.certificates.manage',label:'Manage certificates'},{id:'ai.view',label:'View AI & automation'},{id:'ai.manage',label:'Manage AI & automation'},{id:'energy.view',label:'View energy optimization'},{id:'energy.manage',label:'Manage energy optimization'},{id:'audit.view',label:'View audit log'},{id:'reports.manage',label:'Manage reports & exports'},{id:'platform.settings.view',label:'View platform settings'},{id:'platform.settings.manage',label:'Manage platform settings'}
      ]}
    ],
    roles:[
      {id:'ROLE-PLATFORM-ADMIN',name:'Platform Admin',description:'Full platform administration across all companies and modules.',type:'system',privileged:true,scopeModel:'Platform',permissions:['*'],users:2},
      {id:'ROLE-COMPANY-ADMIN',name:'Company Admin',description:'Administration limited to one company and its operating scope.',type:'system',privileged:true,scopeModel:'Company',permissions:['admin.portal.view','companies.view','users.view','users.manage','markets.view','chargers.view','sessions.view','reservations.manage','fleet.view','fleet.manage','maintenance.view','tariffs.view','taxes.view','payments.view','accounting.view','settlements.view','integrations.view','audit.view'],users:9},
      {id:'ROLE-OP-SUPERVISOR',name:'Operator Supervisor',description:'Extended network operations including restricted remote controls.',type:'system',privileged:true,scopeModel:'Company / Region / Site',permissions:['chargers.view','chargers.remote.restart','chargers.disable','sessions.view','sessions.force_stop','reservations.manage','maintenance.view','diagnostics.remote','payments.view','audit.view'],users:11},
      {id:'ROLE-OPERATOR',name:'Operator',description:'Daily network operations without high-risk administrative privileges.',type:'system',privileged:false,scopeModel:'Region / Site',permissions:['chargers.view','chargers.remote.restart','sessions.view','reservations.manage','maintenance.view','payments.view'],users:34},
      {id:'ROLE-FLEET-MANAGER',name:'Fleet Manager',description:'Fleet readiness, depot charging, vehicles, schedules and fleet energy.',type:'system',privileged:false,scopeModel:'Company / Depot',permissions:['fleet.view','fleet.manage','chargers.view','sessions.view','reservations.manage'],users:28},
      {id:'ROLE-TECHNICIAN',name:'Technician',description:'Field maintenance, diagnostics, parts and service completion.',type:'system',privileged:false,scopeModel:'Region / Site',permissions:['chargers.view','maintenance.view','maintenance.manage','diagnostics.remote'],users:31},
      {id:'ROLE-FINANCE',name:'Finance',description:'Payments, invoices, taxes, settlements and financial reporting.',type:'system',privileged:true,scopeModel:'Company',permissions:['admin.portal.view','payments.view','payments.refund','accounting.view','accounting.manage','tariffs.view','taxes.view','taxes.manage','settlements.view','settlements.manage','integrations.view','audit.view','reports.manage'],users:12},
      {id:'ROLE-SUPPORT',name:'Support Agent',description:'Customer support context with limited session and payment visibility.',type:'system',privileged:false,scopeModel:'Company / Region',permissions:['sessions.view','reservations.manage','payments.view','chargers.view'],users:18},
      {id:'ROLE-AUDITOR',name:'Read Only / Auditor',description:'Read-only visibility for governance and compliance review.',type:'system',privileged:false,scopeModel:'Platform / Company',permissions:['admin.portal.view','companies.view','users.view','markets.view','chargers.view','sessions.view','maintenance.view','tariffs.view','taxes.view','payments.view','accounting.view','settlements.view','roaming.view','integrations.view','firmware.view','security.view','ai.view','energy.view','audit.view','platform.settings.view'],users:8}
    ],
    invitations:[
      {id:'INV-201',name:'Karen Grigoryan',email:'karen.g@nreroute.ge',companyId:'CMP-004',roleId:'ROLE-COMPANY-ADMIN',scope:'North Route Energy · Georgia',status:'sent',twoFactorRequired:true,sentAt:'Aug 12 · 14:30',expiresAt:'Aug 19 · 14:30'},
      {id:'INV-202',name:'Arpi Manukyan',email:'arpi.m@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-SUPPORT',scope:'VoltDrive Armenia · Customer support',status:'sent',twoFactorRequired:true,sentAt:'Aug 15 · 10:12',expiresAt:'Aug 22 · 10:12'},
      {id:'INV-203',name:'Hayk Vardanyan',email:'hayk.v@voltdrive.am',companyId:'CMP-001',roleId:'ROLE-TECHNICIAN',scope:'VoltDrive Armenia · Lori',status:'sent',twoFactorRequired:true,sentAt:'Aug 16 · 17:05',expiresAt:'Aug 23 · 17:05'},
      {id:'INV-204',name:'Elene Beridze',email:'elene.b@nreroute.ge',companyId:'CMP-004',roleId:'ROLE-FINANCE',scope:'North Route Energy · Finance',status:'draft',twoFactorRequired:true,sentAt:'Not sent',expiresAt:'—'},
      {id:'INV-205',name:'Mher Davtyan',email:'mher.d@araratmobility.am',companyId:'CMP-002',roleId:'ROLE-FLEET-MANAGER',scope:'Ararat Mobility · Fleet',status:'sent',twoFactorRequired:false,sentAt:'Aug 17 · 08:41',expiresAt:'Aug 24 · 08:41'}
    ],
    sites:{total:28,active:27,setup:1},
    locations:[
      {id:'LOC-AM-YER-MALL',name:'Yerevan Mall EV Station',companyId:'CMP-001',countryCode:'AM',status:'active',siteType:'Public charging'},
      {id:'LOC-AM-YER-REPUBLIC',name:'Republic Square Charge Hub',companyId:'CMP-001',countryCode:'AM',status:'active',siteType:'Public charging'},
      {id:'LOC-AM-YER-DALMA',name:'Dalma Garden Station',companyId:'CMP-001',countryCode:'AM',status:'active',siteType:'Public charging'},
      {id:'LOC-AM-GYUMRI',name:'Gyumri Charge Hub',companyId:'CMP-001',countryCode:'AM',status:'active',siteType:'Public charging'},
      {id:'LOC-AM-ARARAT-DEPOT',name:'Ararat Fleet Depot',companyId:'CMP-002',countryCode:'AM',status:'active',siteType:'Fleet depot'},
      {id:'LOC-AM-SEVAN',name:'Sevan Destination Hub',companyId:'CMP-003',countryCode:'AM',status:'active',siteType:'Destination charging'},
      {id:'LOC-GE-TBILISI',name:'North Route Tbilisi Hub',companyId:'CMP-004',countryCode:'GE',status:'setup',siteType:'Public charging'},
      {id:'LOC-AM-LAB',name:'VoltDrive Lab',companyId:'CMP-001',countryCode:'AM',status:'internal',siteType:'Lab'}
    ],
    chargers:[
      {id:'AM-YER-HC150-04',locationId:'LOC-AM-YER-MALL',companyId:'CMP-001',modelId:'MODEL-HC150',status:'online'},
      {id:'AM-YER-HC300-009',locationId:'LOC-AM-YER-MALL',companyId:'CMP-001',modelId:'MODEL-HC300',status:'online'},
      {id:'AM-YER-HC150-014',locationId:'LOC-AM-YER-MALL',companyId:'CMP-001',modelId:'MODEL-HC150',status:'online'},
      {id:'AM-YER-HC150-019',locationId:'LOC-AM-YER-REPUBLIC',companyId:'CMP-001',modelId:'MODEL-HC150',status:'online'},
      {id:'AM-YER-HC300-003',locationId:'LOC-AM-YER-REPUBLIC',companyId:'CMP-001',modelId:'MODEL-HC300',status:'online'},
      {id:'AM-YER-HC150-008',locationId:'LOC-AM-YER-DALMA',companyId:'CMP-001',modelId:'MODEL-HC150',status:'online'},
      {id:'SC-AC-08',locationId:'LOC-AM-SEVAN',companyId:'CMP-003',modelId:'MODEL-AC22',status:'online'},
      {id:'LAB-HC300-002',locationId:'LOC-AM-LAB',companyId:'CMP-001',modelId:'MODEL-HC300',status:'lab'}
    ],
    tariffs:{active:16,draft:3,taxProfiles:2,currencies:2,paymentProviders:2},
    taxProfiles:[
      {id:'TAX-001',name:'VAT 20%',countryCode:'AM',taxType:'VAT',rate:20,priceDisplay:'Tax exclusive',status:'active',defaultForMarket:true,invoiceProfile:'Armenia tax invoice',invoicePrefix:'VD-AM',numberingRule:'Continuous sequence',registrationSource:'Company tax ID',effectiveFrom:'2026-01-01',taxable:{energy:true,chargingMinute:true,connection:true,reservation:true,parking:true,idle:true},notes:'Default Armenia platform tax profile used by companies unless overridden.',lastUpdated:'2026-08-16 18:42'},
      {id:'TAX-002',name:'VAT profile incomplete',countryCode:'GE',taxType:'VAT',rate:null,priceDisplay:'Tax exclusive',status:'draft',defaultForMarket:true,invoiceProfile:'Setup required',invoicePrefix:'',numberingRule:'Not configured',registrationSource:'Not configured',effectiveFrom:'Not configured',taxable:{energy:true,chargingMinute:true,connection:true,reservation:true,parking:true,idle:true},notes:'Market setup profile. Rate and invoice rules must be completed before activation.',lastUpdated:'2026-08-17 09:56'}
    ],
    tariffProfiles:[
      {id:'TAR-001',name:'Yerevan DC Standard',version:4,countryCode:'AM',currency:'AMD',companyId:'CMP-001',scopeType:'Market',scopeValue:'Armenia · Public DC network',audience:'Driver',connectorClass:'DC Fast',status:'active',taxProfileId:'TAX-001',energyRate:120,minuteRate:0,connectionFee:0,reservationFee:500,parkingFee:0,idleFee:50,discountType:'None',discountValue:0,scheduleMode:'Always',scheduleDays:'Every day',scheduleStart:'00:00',scheduleEnd:'23:59',effectiveFrom:'2026-06-01',effectiveTo:'',notes:'Default public DC tariff for VoltDrive Armenia.',lastUpdated:'2026-08-16 17:12'},
      {id:'TAR-002',name:'Yerevan DC Peak',version:3,countryCode:'AM',currency:'AMD',companyId:'CMP-001',scopeType:'Site group',scopeValue:'Yerevan high-demand sites',audience:'Driver',connectorClass:'DC Ultra-fast',status:'active',taxProfileId:'TAX-001',energyRate:145,minuteRate:0,connectionFee:300,reservationFee:500,parkingFee:0,idleFee:70,discountType:'None',discountValue:0,scheduleMode:'Time window',scheduleDays:'Mon–Fri',scheduleStart:'17:00',scheduleEnd:'22:00',effectiveFrom:'2026-07-15',effectiveTo:'',notes:'Peak-hours pricing for selected high-demand Yerevan DC sites.',lastUpdated:'2026-08-17 09:12'},
      {id:'TAR-003',name:'Fleet Depot Night',version:2,countryCode:'AM',currency:'AMD',companyId:'CMP-002',scopeType:'Company',scopeValue:'Ararat Mobility · Fleet depots',audience:'Fleet',connectorClass:'AC / DC Fleet',status:'active',taxProfileId:'TAX-001',energyRate:88,minuteRate:0,connectionFee:0,reservationFee:0,parkingFee:0,idleFee:25,discountType:'Percent',discountValue:5,scheduleMode:'Time window',scheduleDays:'Every day',scheduleStart:'23:00',scheduleEnd:'07:00',effectiveFrom:'2026-05-01',effectiveTo:'',notes:'Fleet charging tariff designed for overnight depot charging.',lastUpdated:'2026-08-15 21:10'},
      {id:'TAR-004',name:'Sevan Destination AC',version:1,countryCode:'AM',currency:'AMD',companyId:'CMP-003',scopeType:'Company',scopeValue:'Sevan Charge · Destination sites',audience:'Driver',connectorClass:'AC',status:'active',taxProfileId:'TAX-001',energyRate:95,minuteRate:2,connectionFee:0,reservationFee:300,parkingFee:20,idleFee:35,discountType:'None',discountValue:0,scheduleMode:'Always',scheduleDays:'Every day',scheduleStart:'00:00',scheduleEnd:'23:59',effectiveFrom:'2026-04-01',effectiveTo:'',notes:'Destination charging with separate parking and idle components.',lastUpdated:'2026-08-14 12:20'},
      {id:'TAR-005',name:'North Route Launch',version:1,countryCode:'GE',currency:'GEL',companyId:'CMP-004',scopeType:'Market',scopeValue:'Georgia · Launch network',audience:'Driver',connectorClass:'DC Fast',status:'draft',taxProfileId:'TAX-002',energyRate:0.45,minuteRate:0,connectionFee:0, reservationFee:1.5,parkingFee:0,idleFee:0.2,discountType:'Percent',discountValue:10,scheduleMode:'Always',scheduleDays:'Every day',scheduleStart:'00:00',scheduleEnd:'23:59',effectiveFrom:'2026-09-01',effectiveTo:'',notes:'Prototype launch tariff. Cannot be published while Georgia tax profile remains incomplete.',lastUpdated:'2026-08-17 10:05'},
      {id:'TAR-006',name:'Weekend Ultra-fast Promo',version:1,countryCode:'AM',currency:'AMD',companyId:'CMP-001',scopeType:'Charger group',scopeValue:'Ultra-fast 250–350 kW chargers',audience:'Driver',connectorClass:'DC Ultra-fast',status:'scheduled',taxProfileId:'TAX-001',energyRate:110,minuteRate:0,connectionFee:0,reservationFee:250,parkingFee:0,idleFee:60,discountType:'Percent',discountValue:8,scheduleMode:'Time window',scheduleDays:'Sat–Sun',scheduleStart:'08:00',scheduleEnd:'23:00',effectiveFrom:'2026-08-22',effectiveTo:'2026-09-20',notes:'Scheduled weekend promotion for ultra-fast charging.',lastUpdated:'2026-08-17 10:18'}
    ],
    paymentProviders:[
      {id:'PAY-001',name:'Ameriabank Gateway',providerType:'Card & wallet gateway',companyId:'CMP-001',countryCode:'AM',mode:'Live',status:'connected',methods:['Bank cards','Apple Pay','Google Pay'],currencies:['AMD','USD'],preauthorization:true,preauthRule:'Estimated session + 20% buffer',captureRule:'Automatic on session completion',refunds:true,partialRefunds:true,tokenization:'Provider vault',authentication:'3-D Secure / provider risk rules',settlementCurrency:'AMD',settlementSchedule:'T+1',merchantAccount:'VD-AM-PROD',lastSync:'10:44',notes:'Primary Armenia payment gateway profile for the prototype.'},
      {id:'PAY-002',name:'Georgia Provider Setup',providerType:'Card gateway',companyId:'CMP-004',countryCode:'GE',mode:'Sandbox',status:'setup',methods:['Bank cards'],currencies:['GEL'],preauthorization:true,preauthRule:'Fixed launch authorization',captureRule:'Automatic on session completion',refunds:true,partialRefunds:false,tokenization:'Provider managed',authentication:'Provider default',settlementCurrency:'GEL',settlementSchedule:'Not configured',merchantAccount:'Setup required',lastSync:'Not connected',notes:'Prototype setup profile. Provider credentials and settlement schedule are intentionally incomplete.'}
    ],
    paymentMethods:[
      {id:'PM-CARD',name:'Bank cards',icon:'▤',status:'active',detail:'Visa / Mastercard through configured gateway profiles',providers:['PAY-001','PAY-002']},
      {id:'PM-APPLE',name:'Apple Pay',icon:'A',status:'active',detail:'Digital wallet routed through an eligible card gateway',providers:['PAY-001']},
      {id:'PM-GOOGLE',name:'Google Pay',icon:'G',status:'active',detail:'Digital wallet routed through an eligible card gateway',providers:['PAY-001']},
      {id:'PM-WALLET',name:'Prepaid balance',icon:'¤',status:'active',detail:'Internal wallet balance with optional automatic top-up',providers:[]},
      {id:'PM-CORP',name:'Corporate balance',icon:'C',status:'active',detail:'Company-funded charging balance and billing allocation',providers:[]},
      {id:'PM-PROMO',name:'Promotional credits',icon:'★',status:'active',detail:'Non-cash promotional balance applied by wallet rules',providers:[]}
    ],
    paymentPolicies:{
      preauthorization:{enabled:true,mode:'Estimated session + buffer',bufferPercent:20,fallbackAmount:5000,currency:'AMD',failureAction:'Block paid charging start',releaseRule:'Release unused authorization after final capture'},
      wallet:{enabled:true,autoTopup:true,threshold:2000,topupAmount:10000,currency:'AMD',sources:['Personal balance','Corporate balance','Promotional credits','Refund credits'],negativeBalance:false,fundingOrder:'Promo → Corporate → Personal → Card'},
      refunds:{enabled:true,partialRefunds:true,reasonRequired:true,operatorLimit:20000,currency:'AMD',aboveLimit:'Finance approval required',failedPaymentRefund:'Return to original funding source',auditRequired:true},
      corporate:{enabled:true,corporateBalance:true,monthlyInvoice:true,employeeHomeCharging:true,reimbursementApproval:'Fleet / Finance approval',defaultBillingCycle:'Monthly',costAllocation:'Vehicle / Driver / Department'}
    },

    paymentTransactions:[
      {id:'TXN-240081',companyId:'CMP-001',createdAt:'2026-08-18 10:42',sessionId:'CS-0001542',driver:'Aram Sargsyan',amount:6800,currency:'AMD',method:'Bank card',providerId:'PAY-001',status:'paid',riskScore:12,riskStatus:'clear',reason:'3-D Secure authenticated',authRef:'AUTH-AM-88421'},
      {id:'TXN-240080',companyId:'CMP-001',createdAt:'2026-08-18 10:31',sessionId:'CS-0001541',driver:'Mariam Petrosyan',amount:12400,currency:'AMD',method:'Apple Pay',providerId:'PAY-001',status:'paid',riskScore:18,riskStatus:'clear',reason:'Known device and token',authRef:'AUTH-AM-88420'},
      {id:'TXN-240079',companyId:'CMP-002',createdAt:'2026-08-18 10:14',sessionId:'CS-0001540',driver:'Ararat Fleet 024',amount:18400,currency:'AMD',method:'Corporate balance',providerId:'',status:'paid',riskScore:5,riskStatus:'clear',reason:'Corporate wallet allocation',authRef:'CORP-AR-7721'},
      {id:'TXN-240078',companyId:'CMP-001',createdAt:'2026-08-18 09:58',sessionId:'CS-0001539',driver:'Nare Hakobyan',amount:9300,currency:'AMD',method:'Bank card',providerId:'PAY-001',status:'failed',riskScore:44,riskStatus:'review',reason:'Issuer declined capture after preauthorization',authRef:'AUTH-AM-88418'},
      {id:'TXN-240077',companyId:'CMP-003',createdAt:'2026-08-18 09:42',sessionId:'CS-0001538',driver:'Vardan Melikyan',amount:4200,currency:'AMD',method:'Prepaid balance',providerId:'',status:'paid',riskScore:8,riskStatus:'clear',reason:'Internal wallet',authRef:'WALLET-SC-1108'},
      {id:'TXN-240076',companyId:'CMP-001',createdAt:'2026-08-18 09:20',sessionId:'CS-0001537',driver:'Test Account 81',amount:28700,currency:'AMD',method:'Bank card',providerId:'PAY-001',status:'preauthorized',riskScore:86,riskStatus:'blocked',reason:'Velocity + device mismatch threshold exceeded',authRef:'AUTH-AM-88416'},
      {id:'TXN-240075',companyId:'CMP-001',createdAt:'2026-08-17 18:14',sessionId:'CS-0001528',driver:'Lilit Grigoryan',amount:-3400,currency:'AMD',method:'Bank card',providerId:'PAY-001',status:'refunded',riskScore:9,riskStatus:'clear',reason:'Customer-support approved partial refund',authRef:'REF-AM-12008'}
    ],
    paymentRiskPolicies:{reviewThreshold:55,blockThreshold:80,velocityWindowMinutes:15,maxAttempts:4,require3dsAbove:25000,currency:'AMD',manualReview:true,autoBlockHighRisk:true,auditRequired:true},
    subscriptionPlans:[
      {id:'PLAN-001',companyId:'CMP-001',countryCode:'AM',name:'VoltDrive Plus',planType:'Subscription',audience:'Driver',billingCycle:'Monthly',price:3900,currency:'AMD',includedKwh:0,discountPercent:10,reservationCredits:4,scope:'VoltDrive Armenia public network',status:'active',subscribers:684,notes:'Monthly member discount with reservation credits.'},
      {id:'PLAN-002',companyId:'CMP-001',countryCode:'AM',name:'Fast Charge 100',planType:'Charging package',audience:'Driver',billingCycle:'Prepaid',price:10500,currency:'AMD',includedKwh:100,discountPercent:0,reservationCredits:0,scope:'Public DC chargers',status:'active',subscribers:218,notes:'Prepaid 100 kWh charging package.'},
      {id:'PLAN-003',companyId:'CMP-002',countryCode:'AM',name:'Ararat Fleet 500',planType:'Charging package',audience:'Fleet',billingCycle:'Monthly',price:44000,currency:'AMD',includedKwh:500,discountPercent:5,reservationCredits:0,scope:'Ararat Mobility fleet depots',status:'active',subscribers:41,notes:'Fleet energy package with monthly allocation.'},
      {id:'PLAN-004',companyId:'CMP-003',countryCode:'AM',name:'Sevan Weekend',planType:'Subscription',audience:'Driver',billingCycle:'Monthly',price:2500,currency:'AMD',includedKwh:0,discountPercent:12,reservationCredits:2,scope:'Sevan Charge destination sites',status:'draft',subscribers:0,notes:'Draft destination-charging membership.'}
    ],
    accountingEntries:[
      {id:'JRN-000381',companyId:'CMP-001',date:'2026-08-18',sourceType:'Charging sale',sourceId:'CS-0001542',description:'Charging session revenue',debitAccount:'1210 PSP receivable',creditAccount:'6110 Charging revenue',amount:5666.67,currency:'AMD',taxAmount:1133.33,status:'posted',externalRef:'1C-AR-90341',site:'Yerevan Mall EV Station',charger:'AM-YER-HC150-04'},
      {id:'JRN-000380',companyId:'CMP-001',date:'2026-08-18',sourceType:'VAT',sourceId:'CS-0001542',description:'Output VAT on charging session',debitAccount:'1210 PSP receivable',creditAccount:'3310 VAT payable',amount:1133.33,currency:'AMD',taxAmount:1133.33,status:'posted',externalRef:'1C-AR-90342',site:'Yerevan Mall EV Station',charger:'AM-YER-HC150-04'},
      {id:'JRN-000379',companyId:'CMP-001',date:'2026-08-18',sourceType:'Payment fee',sourceId:'TXN-240081',description:'Payment provider processing fee',debitAccount:'7210 Payment fees',creditAccount:'1210 PSP receivable',amount:204,currency:'AMD',taxAmount:0,status:'posted',externalRef:'1C-AR-90343',site:'Yerevan Mall EV Station',charger:'AM-YER-HC150-04'},
      {id:'JRN-000378',companyId:'CMP-002',date:'2026-08-18',sourceType:'Electricity cost',sourceId:'ENG-AR-0818',description:'Depot charging electricity accrual',debitAccount:'7110 Electricity cost',creditAccount:'3315 Utility payable',amount:126400,currency:'AMD',taxAmount:0,status:'posted',externalRef:'1C-ARARAT-2218',site:'Ararat Central Depot',charger:'Fleet chargers'},
      {id:'JRN-000377',companyId:'CMP-001',date:'2026-08-17',sourceType:'Partner settlement',sourceId:'SET-2407-01',description:'Property owner revenue share accrual',debitAccount:'7310 Partner commissions',creditAccount:'3330 Partner payable',amount:842000,currency:'AMD',taxAmount:0,status:'review',externalRef:'Pending approval',site:'Yerevan Mall EV Station',charger:'—'},
      {id:'JRN-000376',companyId:'CMP-003',date:'2026-08-17',sourceType:'Charging sale',sourceId:'CS-0001538',description:'Destination AC charging revenue',debitAccount:'1210 Wallet receivable',creditAccount:'6110 Charging revenue',amount:3500,currency:'AMD',taxAmount:700,status:'posted',externalRef:'1C-SC-1142',site:'Sevan Waterfront',charger:'SC-AC-08'}
    ],
    accountingMappings:[
      {id:'MAP-ACC-01',companyId:'CMP-001',source:'Charging revenue',debitAccount:'1210 PSP / wallet receivable',creditAccount:'6110 Charging revenue',taxAccount:'3310 VAT payable',status:'active'},
      {id:'MAP-ACC-02',companyId:'CMP-001',source:'Reservation fee',debitAccount:'1210 PSP / wallet receivable',creditAccount:'6120 Reservation revenue',taxAccount:'3310 VAT payable',status:'active'},
      {id:'MAP-ACC-03',companyId:'CMP-001',source:'Idle & parking fee',debitAccount:'1210 PSP / wallet receivable',creditAccount:'6130 Parking & idle revenue',taxAccount:'3310 VAT payable',status:'active'},
      {id:'MAP-ACC-04',companyId:'CMP-001',source:'Payment provider fee',debitAccount:'7210 Payment fees',creditAccount:'1210 PSP receivable',taxAccount:'—',status:'active'},
      {id:'MAP-ACC-05',companyId:'CMP-001',source:'Partner share',debitAccount:'7310 Partner commissions',creditAccount:'3330 Partner payable',taxAccount:'—',status:'active'},
      {id:'MAP-ACC-06',companyId:'CMP-002',source:'Electricity cost',debitAccount:'7110 Electricity cost',creditAccount:'3315 Utility payable',taxAccount:'—',status:'active'},
      {id:'MAP-ACC-07',companyId:'CMP-003',source:'Refund',debitAccount:'6190 Sales adjustments',creditAccount:'1210 PSP / wallet receivable',taxAccount:'3310 VAT payable',status:'review'}
    ],
    financialReconciliations:[
      {id:'FREC-0818-AM',companyId:'CMP-001',period:'2026-08-18',chargingAmount:3421800,providerAmount:3419300,bankAmount:3419300,difference:2500,currency:'AMD',sessions:428,matchedTransactions:425,totalTransactions:428,status:'review',detail:'Three failed/pending captures explain the current difference.'},
      {id:'FREC-0817-AM',companyId:'CMP-001',period:'2026-08-17',chargingAmount:7814200,providerAmount:7814200,bankAmount:7814200,difference:0,currency:'AMD',sessions:936,matchedTransactions:936,totalTransactions:936,status:'matched',detail:'Charging, PSP and bank totals fully reconciled.'},
      {id:'FREC-0817-AR',companyId:'CMP-002',period:'2026-08-17',chargingAmount:1260400,providerAmount:1260400,bankAmount:1260400,difference:0,currency:'AMD',sessions:141,matchedTransactions:141,totalTransactions:141,status:'matched',detail:'Corporate wallet and external payment allocations reconciled.'}
    ],
    profitabilityRecords:[
      {id:'PROF-001',companyId:'CMP-001',scopeType:'Site',entity:'Yerevan Mall EV Station',revenue:2840000,electricityCost:1210000,paymentFees:85200,partnerShare:340800,taxes:473333,currency:'AMD'},
      {id:'PROF-002',companyId:'CMP-001',scopeType:'Charger',entity:'AM-YER-HC300-009',revenue:684000,electricityCost:292000,paymentFees:20520,partnerShare:82080,taxes:114000,currency:'AMD'},
      {id:'PROF-003',companyId:'CMP-002',scopeType:'Site',entity:'Ararat Central Depot',revenue:1480000,electricityCost:632000,paymentFees:18000,partnerShare:0,taxes:246667,currency:'AMD'},
      {id:'PROF-004',companyId:'CMP-003',scopeType:'Site',entity:'Sevan Waterfront',revenue:742000,electricityCost:301000,paymentFees:22260,partnerShare:89040,taxes:123667,currency:'AMD'}
    ],
    accountingPolicies:{postingMode:'Accrual by completed business event',periodLock:'Finance approval',requireBalancedEntries:true,requireSourceReference:true,allowManualJournal:true,manualJournalApproval:'Finance + audit reason',erpExport:'Post only approved entries',baseCurrency:'AMD'},

    partners:[
      {id:'PRT-001',name:'Yerevan Mall Property',legalName:'Yerevan Mall Property CJSC',partnerType:'Property owner',companyId:'CMP-001',countryCode:'AM',currency:'AMD',scope:'Yerevan Mall EV Station · 4 charging bays',linkedSites:1,contractId:'CTR-001',contractStatus:'active',contractStart:'2026-01-01',contractEnd:'2027-12-31',revenueModel:'Percent of net charging revenue',shareType:'Percent',shareValue:12,settlementCycle:'Monthly',settlementDay:'Last business day',taxTreatment:'Partner invoice required',bankProfile:'AMD settlement account · verified',contactEmail:'finance@yerevanmall.example',status:'active',outstandingBalance:842000,nextSettlement:'2026-08-31',lastSettlement:'2026-07-31',notes:'Prototype property-owner revenue-share agreement for a hosted public charging site.'},
      {id:'PRT-002',name:'Ararat Facilities Group',legalName:'Ararat Facilities Group LLC',partnerType:'Site host',companyId:'CMP-002',countryCode:'AM',currency:'AMD',scope:'Ararat Mobility · 2 depot sites',linkedSites:2,contractId:'CTR-002',contractStatus:'active',contractStart:'2026-03-01',contractEnd:'2027-02-28',revenueModel:'Fixed monthly site fee',shareType:'Fixed monthly',shareValue:320000,settlementCycle:'Monthly',settlementDay:'5th business day',taxTreatment:'VAT invoice required',bankProfile:'AMD settlement account · verified',contactEmail:'billing@araratfacilities.example',status:'active',outstandingBalance:320000,nextSettlement:'2026-09-05',lastSettlement:'2026-08-05',notes:'Prototype fixed host-fee agreement. Charging revenue remains with the operating company.'},
      {id:'PRT-003',name:'Sevan Hospitality Group',legalName:'Sevan Hospitality Group LLC',partnerType:'Property owner',companyId:'CMP-003',countryCode:'AM',currency:'AMD',scope:'Sevan destination network · 4 sites',linkedSites:4,contractId:'CTR-003',contractStatus:'active',contractStart:'2026-04-01',contractEnd:'2028-03-31',revenueModel:'Percent of charging and parking revenue',shareType:'Percent',shareValue:15,settlementCycle:'Monthly',settlementDay:'10th day',taxTreatment:'Partner invoice required',bankProfile:'AMD settlement account · verified',contactEmail:'accounts@sevanhospitality.example',status:'active',outstandingBalance:615400,nextSettlement:'2026-09-10',lastSettlement:'2026-08-10',notes:'Prototype destination-charging agreement including eligible parking revenue.'},
      {id:'PRT-004',name:'North Route Property Partners',legalName:'North Route Property Partners LLC',partnerType:'Property owner',companyId:'CMP-004',countryCode:'GE',currency:'GEL',scope:'Georgia launch network · 3 planned sites',linkedSites:3,contractId:'CTR-004',contractStatus:'draft',contractStart:'2026-09-01',contractEnd:'2028-08-31',revenueModel:'Percent of net charging revenue',shareType:'Percent',shareValue:10,settlementCycle:'Monthly',settlementDay:'Not configured',taxTreatment:'Setup required',bankProfile:'Bank profile pending verification',contactEmail:'finance@northroutelocations.example',status:'setup',outstandingBalance:0,nextSettlement:'Not scheduled',lastSettlement:'Never',notes:'Prototype launch partner. Settlement activation is intentionally blocked until Georgia tax/payment setup and bank verification are complete.'}
    ],
    settlementRuns:[
      {id:'SET-2607-001',partnerId:'PRT-001',companyId:'CMP-001',period:'2026-07',grossRevenue:7850000,taxAmount:1308333,paymentFees:196250,adjustments:-25000,partnerShare:758450,netPayable:758450,currency:'AMD',reconciliationStatus:'reconciled',settlementStatus:'paid',dueDate:'2026-07-31',paidAt:'2026-07-31 16:22',reference:'BANK-VD-0731-01',notes:'July property-owner share.'},
      {id:'SET-2608-001',partnerId:'PRT-001',companyId:'CMP-001',period:'2026-08 MTD',grossRevenue:8725000,taxAmount:1454167,paymentFees:218125,adjustments:0,partnerShare:842000,netPayable:842000,currency:'AMD',reconciliationStatus:'ready',settlementStatus:'scheduled',dueDate:'2026-08-31',paidAt:'',reference:'Draft',notes:'Current prototype settlement estimate.'},
      {id:'SET-2608-002',partnerId:'PRT-002',companyId:'CMP-002',period:'2026-08',grossRevenue:4160000,taxAmount:693333,paymentFees:104000,adjustments:0,partnerShare:320000,netPayable:320000,currency:'AMD',reconciliationStatus:'ready',settlementStatus:'scheduled',dueDate:'2026-09-05',paidAt:'',reference:'Draft',notes:'Fixed monthly host fee.'},
      {id:'SET-2608-003',partnerId:'PRT-003',companyId:'CMP-003',period:'2026-08',grossRevenue:4930000,taxAmount:821667,paymentFees:123250,adjustments:15000,partnerShare:615400,netPayable:615400,currency:'AMD',reconciliationStatus:'review',settlementStatus:'draft',dueDate:'2026-09-10',paidAt:'',reference:'Review required',notes:'Parking revenue mapping has an adjustment requiring finance review.'},
      {id:'SET-2609-001',partnerId:'PRT-004',companyId:'CMP-004',period:'2026-09 launch',grossRevenue:0,taxAmount:0,paymentFees:0,adjustments:0,partnerShare:0,netPayable:0,currency:'GEL',reconciliationStatus:'blocked',settlementStatus:'blocked',dueDate:'Not scheduled',paidAt:'',reference:'Configuration blocked',notes:'Georgia settlement blocked by incomplete tax/payment setup and unverified partner banking.'}
    ],
    settlementPolicies:{
      defaultCycle:'Monthly',approvalThreshold:1000000,approvalCurrency:'AMD',dualApproval:true,negativeBalanceHandling:'Carry forward to next settlement',invoiceRequirement:'Partner invoice required where configured',reconciliationTolerance:1000,autoReadyWhenMatched:true,paymentReferenceFormat:'SET-{period}-{partner}',auditRequired:true
    },

    roamingPartners:[
      {id:'RMG-001',name:'Caucasus Charge',legalName:'Caucasus Charge Network LLC',country:'Georgia',countryCode:'GE',partnerRole:'CPO + eMSP',protocol:'OCPI 2.2.1',connectionStatus:'connected',agreementStatus:'active',agreementId:'RAG-001',agreementStart:'2025-09-15',agreementEnd:'2026-09-14',operatorCode:'CCG',partyId:'CCG',businessCode:'GE*CCG',settlementCurrency:'GEL',commissionType:'Percent',commissionValue:4,fxRule:'Daily provider rate',settlementCycle:'Monthly',authorizationMode:'Real-time token authorization',reservations:true,locations:true,tariffs:true,availability:true,sessions:true,cdrs:true,remoteStart:true,locationsShared:142,tariffsShared:18,sessionsMtd:684,lastSync:'10:39',latency:'51 sec',endpoint:'Production hub',certificateStatus:'valid',status:'active',notes:'Prototype bilateral roaming agreement. Renewal is due within 28 days.'},
      {id:'RMG-002',name:'Armenia DriveNet',legalName:'Armenia DriveNet CJSC',country:'Armenia',countryCode:'AM',partnerRole:'eMSP',protocol:'OCPI 2.2.1',connectionStatus:'connected',agreementStatus:'active',agreementId:'RAG-002',agreementStart:'2026-02-01',agreementEnd:'2027-01-31',operatorCode:'ADN',partyId:'ADN',businessCode:'AM*ADN',settlementCurrency:'AMD',commissionType:'Percent',commissionValue:3.5,fxRule:'No conversion · AMD',settlementCycle:'Monthly',authorizationMode:'Real-time token authorization',reservations:false,locations:true,tariffs:true,availability:true,sessions:true,cdrs:true,remoteStart:true,locationsShared:37,tariffsShared:6,sessionsMtd:214,lastSync:'10:36',latency:'28 sec',endpoint:'Production direct',certificateStatus:'valid',status:'active',notes:'Prototype domestic eMSP connection used to validate cross-network authorization and CDR settlement.'},
      {id:'RMG-003',name:'CrossCharge Sandbox',legalName:'CrossCharge Test Services',country:'Regional test hub',countryCode:'INT',partnerRole:'CPO + eMSP',protocol:'OCPI 2.2.1',connectionStatus:'setup',agreementStatus:'draft',agreementId:'RAG-003',agreementStart:'2026-09-01',agreementEnd:'2027-08-31',operatorCode:'XCS',partyId:'XCS',businessCode:'ZZ*XCS',settlementCurrency:'EUR',commissionType:'Percent',commissionValue:5,fxRule:'Daily provider rate',settlementCycle:'Monthly',authorizationMode:'Test tokens only',reservations:true,locations:true,tariffs:true,availability:true,sessions:true,cdrs:true,remoteStart:false,locationsShared:0,tariffsShared:0,sessionsMtd:0,lastSync:'Not connected',latency:'—',endpoint:'Sandbox',certificateStatus:'pending',status:'setup',notes:'Prototype sandbox partner. Production activation is blocked until credentials, certificate and agreement approval are complete.'}
    ],
    roamingSettlements:[
      {id:'RSET-2607-001',partnerId:'RMG-001',period:'2026-07',direction:'Net payable',sessions:612,grossAmount:18450.4,commissionAmount:738.02,fxAdjustment:42.11,netAmount:17754.49,currency:'GEL',reconciliationStatus:'reconciled',settlementStatus:'paid',dueDate:'2026-08-10',reference:'ROAM-CCG-202607',notes:'July bilateral roaming settlement.'},
      {id:'RSET-2608-001',partnerId:'RMG-001',period:'2026-08 MTD',direction:'Net payable',sessions:684,grossAmount:20128.75,commissionAmount:805.15,fxAdjustment:-31.4,netAmount:19292.2,currency:'GEL',reconciliationStatus:'ready',settlementStatus:'scheduled',dueDate:'2026-09-10',reference:'Draft',notes:'Current month estimate based on received CDRs.'},
      {id:'RSET-2608-002',partnerId:'RMG-002',period:'2026-08 MTD',direction:'Net receivable',sessions:214,grossAmount:1432000,commissionAmount:50120,fxAdjustment:0,netAmount:1381880,currency:'AMD',reconciliationStatus:'review',settlementStatus:'draft',dueDate:'2026-09-05',reference:'Review required',notes:'Three CDRs have meter-value mismatch and remain under review.'},
      {id:'RSET-2609-001',partnerId:'RMG-003',period:'Launch',direction:'Not started',sessions:0,grossAmount:0,commissionAmount:0,fxAdjustment:0,netAmount:0,currency:'EUR',reconciliationStatus:'blocked',settlementStatus:'blocked',dueDate:'Not scheduled',reference:'Configuration blocked',notes:'Sandbox partner has no production settlement until agreement and security setup are approved.'}
    ],
    roamingDisputes:[
      {id:'RDIS-001',partnerId:'RMG-002',sessionId:'RS-884201',issue:'Meter value mismatch',amount:8200,currency:'AMD',openedAt:'2026-08-16 14:22',owner:'Finance / Roaming',status:'review',detail:'Partner CDR reports 31.2 kWh while local signed meter value reports 28.9 kWh.'},
      {id:'RDIS-002',partnerId:'RMG-001',sessionId:'RS-773918',issue:'Tariff version mismatch',amount:12.4,currency:'GEL',openedAt:'2026-08-15 09:10',owner:'Roaming Operations',status:'open',detail:'Partner applied tariff version 16 after VoltDrive had published version 17.'},
      {id:'RDIS-003',partnerId:'RMG-001',sessionId:'RS-771430',issue:'Duplicate CDR',amount:8.9,currency:'GEL',openedAt:'2026-08-11 18:04',owner:'Finance / Roaming',status:'resolved',detail:'Duplicate CDR was rejected and settlement amount corrected.'}
    ],
    roamingPolicies:{defaultProtocol:'OCPI 2.2.1',defaultSettlementCycle:'Monthly',baseCurrency:'AMD',fxSource:'Daily provider rate',authorizationTimeoutSeconds:20,locationRefreshMinutes:5,tariffRefreshMinutes:15,disputeWindowDays:30,autoImportLocations:true,requireTariffValidation:true,requireSignedCdr:true,blockUnknownTokens:true,auditRequired:true},
    integrations:[
      {id:'INT-1C',type:'ERP',name:'1C ERP Armenia',status:'connected',detail:'Sales, payments, refunds and tax export',lastSync:'10:41',latency:'34 sec',icon:'1C'},
      {id:'INT-PAY',type:'Payments',name:'Ameriabank Gateway',status:'connected',detail:'Cards, preauthorization and refunds',lastSync:'10:44',latency:'Live',icon:'¤'},
      {id:'INT-ROAM',type:'Roaming',name:'OCPI Partner Hub',status:'connected',detail:'Locations, tariffs, sessions and settlements',lastSync:'10:39',latency:'51 sec',icon:'⇄'},
      {id:'INT-CERT',type:'Security',name:'Platform Certificates',status:'warning',detail:'2 certificates expire within 30 days',lastSync:'10:30',latency:'Action needed',icon:'◇'},
      {id:'INT-FW',type:'Firmware',name:'Firmware Campaign Service',status:'scheduled',detail:'Campaign FW-2026.08 starts tonight',lastSync:'10:25',latency:'23 chargers',icon:'↻'},
      {id:'INT-ENERGY',type:'Energy',name:'Energy Policy Engine',status:'warning',detail:'5 active site policies · 4 demand-response capable sites',lastSync:'10:50',latency:'170 kW safety headroom',icon:'⚡'},
      {id:'INT-AI',type:'AI',name:'AI & Automation',status:'connected',detail:'4 active models · 2 approvals waiting',lastSync:'10:48',latency:'96% forecast health',icon:'✦'}
    ],
    enterpriseIntegrations:[
      {id:'EINT-1C',name:'1C ERP Armenia',system:'1C',category:'ERP',companyId:'CMP-001',countryCode:'AM',environment:'Production',direction:'Bidirectional',transport:'HTTPS API / scheduled export',status:'connected',authMode:'Service credentials',endpointLabel:'Armenia finance exchange',schedule:'Every 15 min + daily close',lastSync:'2026-08-17 10:41',lastResult:'success',recordsLastRun:438,latency:'34 sec',objects:['Sales','Payments','Refunds','Taxes','Invoices','Partner settlements','Customer balances'],currency:'AMD',reconciliation:true,autoRetry:true,notes:'Primary prototype ERP integration. Concrete 1C endpoint and data contract are intentionally not defined in the source documentation.'},
      {id:'EINT-SAP',name:'SAP Finance Template',system:'SAP',category:'ERP',companyId:'CMP-001',countryCode:'AM',environment:'Template',direction:'Outbound',transport:'API / file exchange',status:'template',authMode:'Not configured',endpointLabel:'Not configured',schedule:'Not configured',lastSync:'Never',lastResult:'not-configured',recordsLastRun:0,latency:'—',objects:['Sales','Payments','Taxes','Invoices','Partner settlements'],currency:'AMD',reconciliation:true,autoRetry:false,notes:'Configuration template only. The documentation requires SAP support but does not prescribe a concrete SAP interface.'},
      {id:'EINT-ORACLE',name:'Oracle ERP Template',system:'Oracle',category:'ERP',companyId:'CMP-001',countryCode:'AM',environment:'Template',direction:'Outbound',transport:'API / file exchange',status:'template',authMode:'Not configured',endpointLabel:'Not configured',schedule:'Not configured',lastSync:'Never',lastResult:'not-configured',recordsLastRun:0,latency:'—',objects:['Sales','Payments','Taxes','Invoices','Customer balances'],currency:'AMD',reconciliation:true,autoRetry:false,notes:'Configuration template only. The documentation requires Oracle support but does not prescribe a concrete Oracle interface.'},
      {id:'EINT-API',name:'VoltDrive Business API',system:'REST API',category:'API',companyId:'CMP-001',countryCode:'AM',environment:'Production',direction:'Bidirectional',transport:'HTTPS JSON',status:'connected',authMode:'API key / service token',endpointLabel:'Business integration API',schedule:'Real-time',lastSync:'2026-08-17 10:46',lastResult:'success',recordsLastRun:126,latency:'180 ms',objects:['Companies','Sites','Tariffs','Sessions','Payments','Reports'],currency:'Multi-currency',reconciliation:false,autoRetry:true,notes:'Prototype business integration profile for external systems.'},
      {id:'EINT-WEBHOOK',name:'Finance Event Webhooks',system:'Webhooks',category:'Events',companyId:'CMP-001',countryCode:'AM',environment:'Production',direction:'Outbound',transport:'HTTPS webhook',status:'warning',authMode:'Signed secret',endpointLabel:'Finance notification receiver',schedule:'Event driven',lastSync:'2026-08-17 10:43',lastResult:'warning',recordsLastRun:92,latency:'2 retries',objects:['Payment completed','Payment failed','Refund issued','Invoice created','Settlement paid'],currency:'N/A',reconciliation:false,autoRetry:true,notes:'Two delivery retries are currently shown to demonstrate monitoring and recovery states.'}
    ],
    integrationMappings:[
      {id:'MAP-001',integrationId:'EINT-1C',source:'Charging Session',target:'Sales document',scope:'Completed paid sessions',version:7,status:'active',fields:18,lastChanged:'2026-08-17 09:35',owner:'Finance Integration'},
      {id:'MAP-002',integrationId:'EINT-1C',source:'Payment',target:'Payment receipt',scope:'Paid / refunded payments',version:5,status:'active',fields:14,lastChanged:'2026-08-11 16:20',owner:'Finance Integration'},
      {id:'MAP-003',integrationId:'EINT-1C',source:'Tax breakdown',target:'Tax accounting lines',scope:'Armenia VAT profile',version:4,status:'active',fields:9,lastChanged:'2026-08-05 12:40',owner:'Finance'},
      {id:'MAP-004',integrationId:'EINT-1C',source:'Partner Settlement',target:'Partner settlement export',scope:'Approved settlement runs',version:3,status:'review',fields:16,lastChanged:'2026-08-17 09:35',owner:'Finance Integration'},
      {id:'MAP-005',integrationId:'EINT-API',source:'Charging Session',target:'Session API resource',scope:'Authorized business clients',version:2,status:'active',fields:22,lastChanged:'2026-08-09 13:15',owner:'Platform API'}
    ],
    integrationSyncJobs:[
      {id:'JOB-8841',integrationId:'EINT-1C',jobType:'Incremental sync',object:'Payments + sessions',startedAt:'10:41',duration:'34 sec',records:438,status:'success',message:'Export completed and acknowledgement received.'},
      {id:'JOB-8840',integrationId:'EINT-WEBHOOK',jobType:'Event delivery',object:'Refund issued',startedAt:'10:43',duration:'6 sec',records:1,status:'warning',message:'Delivered after 2 retries.'},
      {id:'JOB-8839',integrationId:'EINT-API',jobType:'Real-time API',object:'Business resources',startedAt:'10:39',duration:'180 ms',records:126,status:'success',message:'Requests processed within configured limits.'},
      {id:'JOB-8838',integrationId:'EINT-1C',jobType:'Reconciliation',object:'2026-08-16 daily close',startedAt:'08:10',duration:'2 min 18 sec',records:1264,status:'success',message:'Financial totals matched within tolerance.'},
      {id:'JOB-8837',integrationId:'EINT-1C',jobType:'Settlement export',object:'Partner settlements',startedAt:'07:50',duration:'42 sec',records:12,status:'review',message:'Mapping version 3 changed and requires review before next close.'}
    ],
    integrationErrors:[
      {id:'IERR-021',integrationId:'EINT-WEBHOOK',severity:'warning',code:'DELIVERY_RETRY',title:'Webhook required retries',detail:'Refund event delivery succeeded after two retry attempts.',occurredAt:'10:43',status:'monitoring'},
      {id:'IERR-020',integrationId:'EINT-1C',severity:'info',code:'MAPPING_REVIEW',title:'Settlement mapping changed',detail:'Partner settlement mapping version 3 was modified and is waiting for Finance review.',occurredAt:'09:35',status:'review'},
      {id:'IERR-019',integrationId:'EINT-1C',severity:'resolved',code:'ACK_TIMEOUT',title:'ERP acknowledgement timeout',detail:'A previous acknowledgement delay was retried automatically and completed successfully.',occurredAt:'2026-08-16 17:12',status:'resolved'}
    ],
    integrationReconciliation:[
      {id:'REC-260816',integrationId:'EINT-1C',period:'2026-08-16',platformSales:9842000,externalSales:9842000,difference:0,currency:'AMD',paymentsMatched:312,paymentsTotal:312,status:'matched'},
      {id:'REC-260815',integrationId:'EINT-1C',period:'2026-08-15',platformSales:10561200,externalSales:10560200,difference:1000,currency:'AMD',paymentsMatched:341,paymentsTotal:342,status:'review'},
      {id:'REC-260814',integrationId:'EINT-1C',period:'2026-08-14',platformSales:9175000,externalSales:9175000,difference:0,currency:'AMD',paymentsMatched:298,paymentsTotal:298,status:'matched'}
    ],
    integrationPolicies:{defaultRetryCount:3,retryBackoff:'Exponential',dailyCloseTime:'02:00',reconciliationTolerance:1000,baseCurrency:'AMD',requireMappingApproval:true,requireAudit:true,maskSecrets:true,failedJobAlert:true,retentionDays:90},
    attention:[
      {id:'ATT-001',severity:'critical',title:'Certificate expires in 12 days',detail:'CSMS client certificate for Armenia production must be renewed.',time:'10:32',module:'Security & Certificates',entity:'CERT-CSMS-AM-01'},
      {id:'ATT-002',severity:'warning',title:'3 access requests waiting for approval',detail:'Two Operator Supervisor requests and one Finance role request.',time:'10:18',module:'Users & Access',entity:'Access approvals'},
      {id:'ATT-003',severity:'warning',title:'Georgia VAT profile is incomplete',detail:'Tax invoice numbering and VAT registration fields are missing.',time:'09:56',module:'Countries & Taxes',entity:'Georgia'},
      {id:'ATT-004',severity:'info',title:'ERP mapping changed',detail:'1C settlement export mapping was updated and requires review before next close.',time:'09:35',module:'ERP & Integrations',entity:'INT-1C'},
      {id:'ATT-005',severity:'info',title:'Roaming agreement renewal due',detail:'Partner agreement with Caucasus Charge expires in 28 days.',time:'08:48',module:'Roaming',entity:'Caucasus Charge'}
    ],
    accessRequests:[
      {id:'AR-1007',name:'Mariam Hovsepyan',email:'mariam.h@voltdrive.am',companyId:'CMP-001',requestedRoleId:'ROLE-OP-SUPERVISOR',requestedRole:'Operator Supervisor',scope:'VoltDrive Armenia · All sites',reason:'Shift lead coverage for Yerevan operations.',requestedAt:'Today · 10:18',status:'review'},
      {id:'AR-1008',name:'Levon Sargsyan',email:'levon.s@voltdrive.am',companyId:'CMP-001',requestedRoleId:'ROLE-OP-SUPERVISOR',requestedRole:'Operator Supervisor',scope:'VoltDrive Armenia · Yerevan',reason:'Temporary supervisor coverage for evening shifts.',requestedAt:'Today · 09:58',status:'review'},
      {id:'AR-1009',name:'Lilit Petrosyan',email:'lilit.p@voltdrive.am',companyId:'CMP-001',requestedRoleId:'ROLE-FINANCE',requestedRole:'Finance',scope:'VoltDrive Armenia',reason:'Monthly settlement and refund review responsibilities.',requestedAt:'Today · 09:41',status:'review'}
    ],
    security:{twoFactorCoverage:96,privilegedUsers:14,certificates:18,expiringCertificates:2,auditEventsToday:47,lastPermissionChange:'10:18',blockedEntities:4,criticalEvents:1},
    securityCertificates:[
      {id:'CERT-CSMS-AM-01',name:'Armenia CSMS Client',type:'CSMS client',environment:'Production',scope:'Armenia charging network',issuer:'VoltDrive Platform CA',serial:'VD-AM-CSMS-0017',validFrom:'2025-08-29',expiresAt:'2026-08-29',owner:'Platform Security',autoRenew:false,status:'expiring',fingerprint:'Managed in secure certificate store',notes:'Production client certificate used for charger-to-platform trust. Renewal is required before expiry.'},
      {id:'CERT-OCPI-GE-01',name:'Caucasus Charge mTLS',type:'Roaming mTLS',environment:'Production',scope:'Caucasus Charge · OCPI',issuer:'Partner Trust CA',serial:'CCG-OCPI-8841',validFrom:'2025-09-01',expiresAt:'2026-09-01',owner:'Roaming Operations',autoRenew:false,status:'expiring',fingerprint:'Managed in secure certificate store',notes:'Bilateral mTLS certificate for roaming production connection.'},
      {id:'CERT-CSMS-SRV-01',name:'VoltDrive CSMS Server',type:'CSMS server',environment:'Production',scope:'Platform · charger endpoints',issuer:'VoltDrive Platform CA',serial:'VD-CSMS-SRV-0231',validFrom:'2026-02-15',expiresAt:'2027-02-15',owner:'Platform Security',autoRenew:true,status:'active',fingerprint:'Managed in secure certificate store',notes:'Server identity for charger communication endpoints.'},
      {id:'CERT-API-GW-01',name:'Business API Gateway TLS',type:'API TLS',environment:'Production',scope:'Business API',issuer:'Public Trust Provider',serial:'API-GW-2026-04',validFrom:'2026-04-04',expiresAt:'2027-04-04',owner:'Platform Engineering',autoRenew:true,status:'active',fingerprint:'Managed in secure certificate store',notes:'Public TLS certificate for the platform business API.'},
      {id:'CERT-ADMIN-WEB-01',name:'Admin Portal TLS',type:'Web TLS',environment:'Production',scope:'Admin Portal',issuer:'Public Trust Provider',serial:'ADMIN-WEB-2026',validFrom:'2026-05-11',expiresAt:'2027-05-11',owner:'Platform Engineering',autoRenew:true,status:'active',fingerprint:'Managed in secure certificate store',notes:'TLS certificate for administrative web access.'},
      {id:'CERT-OP-WEB-01',name:'Operator Portal TLS',type:'Web TLS',environment:'Production',scope:'Operator Portal',issuer:'Public Trust Provider',serial:'OP-WEB-2026',validFrom:'2026-05-11',expiresAt:'2027-05-11',owner:'Platform Engineering',autoRenew:true,status:'active',fingerprint:'Managed in secure certificate store',notes:'TLS certificate for operator portal access.'},
      {id:'CERT-FLEET-WEB-01',name:'Fleet Portal TLS',type:'Web TLS',environment:'Production',scope:'Fleet Manager Portal',issuer:'Public Trust Provider',serial:'FLEET-WEB-2026',validFrom:'2026-05-11',expiresAt:'2027-05-11',owner:'Platform Engineering',autoRenew:true,status:'active',fingerprint:'Managed in secure certificate store',notes:'TLS certificate for fleet manager portal.'},
      {id:'CERT-TECH-WEB-01',name:'Technician Portal TLS',type:'Web TLS',environment:'Production',scope:'Technician Portal',issuer:'Public Trust Provider',serial:'TECH-WEB-2026',validFrom:'2026-05-11',expiresAt:'2027-05-11',owner:'Platform Engineering',autoRenew:true,status:'active',fingerprint:'Managed in secure certificate store',notes:'TLS certificate for technician portal.'},
      {id:'CERT-PAY-SIGN-01',name:'Payment Webhook Signing',type:'Webhook signing',environment:'Production',scope:'Ameriabank Gateway',issuer:'VoltDrive Internal PKI',serial:'PAY-SIGN-0042',validFrom:'2026-01-22',expiresAt:'2027-01-22',owner:'Finance Platform',autoRenew:false,status:'active',fingerprint:'Managed in secure certificate store',notes:'Verifies payment-provider webhook signatures.'},
      {id:'CERT-ERP-1C-01',name:'1C Integration Client',type:'ERP client',environment:'Production',scope:'1C ERP Armenia',issuer:'VoltDrive Internal PKI',serial:'ERP-1C-0198',validFrom:'2026-03-10',expiresAt:'2027-03-10',owner:'Finance Integrations',autoRenew:false,status:'active',fingerprint:'Managed in secure certificate store',notes:'Client certificate for authenticated ERP exchange where enabled.'},
      {id:'CERT-SSO-01',name:'Corporate SSO Signing',type:'SSO signing',environment:'Production',scope:'Employee identity federation',issuer:'Corporate Identity CA',serial:'SSO-SIGN-2026',validFrom:'2026-02-01',expiresAt:'2027-02-01',owner:'Identity & Access',autoRenew:false,status:'active',fingerprint:'Managed in secure certificate store',notes:'Signing certificate used by the corporate identity federation profile.'},
      {id:'CERT-FW-SIGN-01',name:'Firmware Release Signing',type:'Firmware signing',environment:'Production',scope:'Approved charger firmware',issuer:'VoltDrive Release CA',serial:'FW-SIGN-0104',validFrom:'2026-01-08',expiresAt:'2027-01-08',owner:'Release Security',autoRenew:false,status:'active',fingerprint:'Managed in HSM-backed signing service',notes:'Metadata record only; private signing material is not exposed in Admin Portal.'},
      {id:'CERT-CHARGER-CA-01',name:'Production Charger Issuing CA',type:'Charger CA',environment:'Production',scope:'Armenia charger fleet',issuer:'VoltDrive Root CA',serial:'CHG-ICA-0001',validFrom:'2025-01-01',expiresAt:'2029-01-01',owner:'Platform Security',autoRenew:false,status:'active',fingerprint:'Managed in secure certificate store',notes:'Intermediate CA for production charger identities.'},
      {id:'CERT-CHARGER-BATCH-21',name:'HC Charger Identity Batch 21',type:'Charger identity batch',environment:'Production',scope:'HyperCharge HC-150/300',issuer:'Production Charger Issuing CA',serial:'HC-BATCH-0021',validFrom:'2026-06-05',expiresAt:'2028-06-05',owner:'Device Security',autoRenew:true,status:'active',fingerprint:'Batch managed by device certificate service',notes:'Represents a managed batch of charger client identities.'},
      {id:'CERT-MOBILE-API-01',name:'Driver Mobile API TLS',type:'API TLS',environment:'Production',scope:'Driver mobile API',issuer:'Public Trust Provider',serial:'MOB-API-2026',validFrom:'2026-04-04',expiresAt:'2027-04-04',owner:'Platform Engineering',autoRenew:true,status:'active',fingerprint:'Managed in secure certificate store',notes:'TLS endpoint certificate used by the driver application API.'},
      {id:'CERT-WEBHOOK-01',name:'Outbound Event Signing',type:'Webhook signing',environment:'Production',scope:'Business webhooks',issuer:'VoltDrive Internal PKI',serial:'WH-SIGN-0062',validFrom:'2026-03-16',expiresAt:'2027-03-16',owner:'Integrations',autoRenew:false,status:'active',fingerprint:'Managed in secure certificate store',notes:'Signs outbound business events where partner verification is configured.'},
      {id:'CERT-LAB-OCPI-01',name:'CrossCharge Sandbox mTLS',type:'Roaming mTLS',environment:'Sandbox',scope:'CrossCharge Sandbox',issuer:'Sandbox Trust CA',serial:'XCS-SBX-0088',validFrom:'2026-08-10',expiresAt:'2027-08-10',owner:'Roaming Operations',autoRenew:false,status:'pending',fingerprint:'Pending partner validation',notes:'Sandbox certificate pending validation before partner activation.'},
      {id:'CERT-LEGACY-API-01',name:'Legacy API Client',type:'API client',environment:'Production',scope:'Retired partner API',issuer:'VoltDrive Internal PKI',serial:'LEGACY-API-0011',validFrom:'2024-07-01',expiresAt:'2026-07-01',owner:'Platform Security',autoRenew:false,status:'revoked',fingerprint:'Revoked',notes:'Retired integration certificate. Revoked and retained for audit history.'}
    ],
    securityEvents:[
      {id:'SEV-1047',time:'10:44',severity:'critical',category:'Device trust',title:'Charger certificate mismatch blocked',detail:'AM-YER-HC300-009 presented an identity outside the expected certificate chain and was isolated from remote commands.',actor:'Automated security control',status:'open'},
      {id:'SEV-1046',time:'10:32',severity:'warning',category:'Certificate',title:'Certificate renewal window entered',detail:'CERT-CSMS-AM-01 expires within the configured renewal threshold.',actor:'Certificate monitor',status:'review'},
      {id:'SEV-1045',time:'10:21',severity:'warning',category:'Identity',title:'Privileged sign-in challenged',detail:'A Platform Admin sign-in from a new device required additional MFA verification.',actor:'Identity service',status:'resolved'},
      {id:'SEV-1044',time:'09:58',severity:'info',category:'RFID',title:'Compromised RFID token blocked',detail:'RFID-88421 was added to the deny list after a customer-support escalation.',actor:'Support Supervisor',status:'resolved'},
      {id:'SEV-1043',time:'09:26',severity:'info',category:'SSO',title:'Corporate SSO assertion validated',detail:'Company administrator authentication completed through the configured corporate identity provider.',actor:'Identity service',status:'resolved'},
      {id:'SEV-1042',time:'08:54',severity:'info',category:'Certificate',title:'Certificate inventory scan completed',detail:'18 certificate records evaluated; 2 require renewal within 30 days.',actor:'Certificate monitor',status:'resolved'}
    ],
    blockedEntities:[
      {id:'BLK-001',type:'RFID',entity:'RFID-88421',scope:'Driver access',reason:'Reported compromised credential',blockedAt:'2026-08-17 09:58',actor:'Support Supervisor',status:'blocked'},
      {id:'BLK-002',type:'Charger',entity:'AM-YER-HC300-009',scope:'Remote commands + authorization',reason:'Certificate identity mismatch',blockedAt:'2026-08-17 10:44',actor:'Automated security control',status:'blocked'},
      {id:'BLK-003',type:'User',entity:'legacy.contractor@voltdrive.am',scope:'Administrative access',reason:'Contractor account retired',blockedAt:'2026-08-12 16:20',actor:'Identity Administrator',status:'blocked'},
      {id:'BLK-004',type:'API client',entity:'client_legacy_partner',scope:'Partner API',reason:'Integration retired',blockedAt:'2026-08-03 11:14',actor:'Platform Security',status:'revoked'}
    ],
    securityPolicies:{require2fa:true,requirePrivileged2fa:true,sessionTimeoutMinutes:30,passwordMinLength:14,loginLockoutAttempts:5,certificateRenewalDays:30,requireTls:true,autoBlockCompromisedDevices:true,blockCompromisedRfid:true,securityEventAlerting:true,auditRetentionDays:365,requireAudit:true,corporateSso:'Optional by company'},
    firmware:{activeCampaigns:1,scheduledChargers:23,currentCoverage:91,failedUpdates:2},
    firmwareVersions:[
      {id:'FWV-382',version:'3.8.2',channel:'Stable',releaseDate:'2026-07-28',status:'current',signed:true,models:['HyperCharge HC-150','HyperCharge HC-300','ChargeCore DC-60'],notes:'Current production baseline for DC chargers. Includes session recovery and thermal telemetry fixes.'},
      {id:'FWV-390',version:'3.9.0',channel:'Release candidate',releaseDate:'2026-08-14',status:'approved',signed:true,models:['HyperCharge HC-150','HyperCharge HC-300'],notes:'Approved candidate used by campaign FW-2026.08. Adds improved connector-lock recovery and diagnostic counters.'},
      {id:'FWV-378',version:'3.7.8',channel:'Maintenance',releaseDate:'2026-06-19',status:'supported',signed:true,models:['ChargeCore DC-60'],notes:'Supported maintenance branch for legacy DC-60 hardware.'},
      {id:'FWV-400B',version:'4.0.0-beta.2',channel:'Lab',releaseDate:'2026-08-10',status:'lab',signed:false,models:['HyperCharge HC-300'],notes:'Lab-only build. Production campaigns are blocked until signing and approval are complete.'}
    ],
    chargerModels:[
      {id:'MODEL-HC150',manufacturer:'HyperCharge',model:'HC-150',power:'150 kW',chargers:18,currentVersion:'3.8.2',targetVersion:'3.9.0',compatibleVersions:['3.8.2','3.9.0'],coverage:100,status:'ready'},
      {id:'MODEL-HC300',manufacturer:'HyperCharge',model:'HC-300',power:'300 kW',chargers:9,currentVersion:'3.8.2',targetVersion:'3.9.0',compatibleVersions:['3.8.2','3.9.0','4.0.0-beta.2'],coverage:89,status:'warning'},
      {id:'MODEL-AC22',manufacturer:'VoltEdge',model:'AC-22',power:'22 kW',chargers:14,currentVersion:'2.6.4',targetVersion:'2.6.4',compatibleVersions:['2.6.4'],coverage:100,status:'current'},
      {id:'MODEL-DC60',manufacturer:'ChargeCore',model:'DC-60',power:'60 kW',chargers:7,currentVersion:'3.7.8',targetVersion:'3.7.8',compatibleVersions:['3.7.8','3.8.2'],coverage:86,status:'review'}
    ],
    firmwareCampaigns:[
      {id:'FW-2026.08',name:'HC Connector Recovery Rollout',version:'3.9.0',scope:'Armenia · HC-150 + HC-300',companyId:'CMP-001',models:['HyperCharge HC-150','HyperCharge HC-300'],chargers:23,scheduledAt:'2026-08-17 23:30',window:'23:30–03:00',strategy:'Staged 10% → 40% → 100%',status:'scheduled',progress:0,success:0,failed:0,rolledBack:0,approval:'approved',autoRollback:true,requiresIdle:true,notes:'Production campaign scheduled outside peak charging hours.'},
      {id:'FW-2026.07',name:'DC Stability Maintenance',version:'3.8.2',scope:'VoltDrive Armenia · DC chargers',companyId:'CMP-001',models:['HyperCharge HC-150','ChargeCore DC-60'],chargers:18,scheduledAt:'2026-07-29 01:00',window:'01:00–04:00',strategy:'Staged 20% → 100%',status:'completed',progress:100,success:17,failed:0,rolledBack:1,approval:'approved',autoRollback:true,requiresIdle:true,notes:'One charger rolled back automatically after post-update health checks failed.'},
      {id:'FW-2026.09',name:'HC-300 Lab Validation',version:'4.0.0-beta.2',scope:'Lab chargers only',companyId:'CMP-001',models:['HyperCharge HC-300'],chargers:2,scheduledAt:'Not scheduled',window:'Lab window',strategy:'Manual validation',status:'draft',progress:0,success:0,failed:0,rolledBack:0,approval:'review',autoRollback:true,requiresIdle:true,notes:'Draft campaign blocked because the firmware build is not signed for production.'}
    ],
    firmwareEvents:[
      {id:'FWE-001',campaignId:'FW-2026.07',charger:'AM-YER-HC150-014',model:'HyperCharge HC-150',fromVersion:'3.7.9',toVersion:'3.8.2',status:'success',time:'2026-07-29 01:18',detail:'Update installed and post-update health checks passed.'},
      {id:'FWE-002',campaignId:'FW-2026.07',charger:'AM-YER-HC150-019',model:'HyperCharge HC-150',fromVersion:'3.7.9',toVersion:'3.8.2',status:'rollback',time:'2026-07-29 01:31',detail:'Connector controller health check failed. Automatic rollback restored previous build.'},
      {id:'FWE-003',campaignId:'FW-2026.08',charger:'AM-YER-HC300-003',model:'HyperCharge HC-300',fromVersion:'3.8.2',toVersion:'3.9.0',status:'scheduled',time:'2026-08-17 23:30',detail:'Included in first staged cohort.'},
      {id:'FWE-004',campaignId:'FW-2026.08',charger:'AM-YER-HC150-008',model:'HyperCharge HC-150',fromVersion:'3.8.2',toVersion:'3.9.0',status:'scheduled',time:'2026-08-17 23:30',detail:'Included in first staged cohort.'},
      {id:'FWE-005',campaignId:'FW-2026.09',charger:'LAB-HC300-002',model:'HyperCharge HC-300',fromVersion:'3.9.0',toVersion:'4.0.0-beta.2',status:'blocked',time:'Not scheduled',detail:'Firmware signing and release approval are incomplete.'}
    ],
    firmwarePolicies:{defaultWindow:'23:00–04:00',stagedRollout:true,firstCohortPercent:10,healthCheckMinutes:15,maxParallelUpdates:5,requireIdleCharger:true,requireSignedFirmware:true,requireApproval:true,autoRollback:true,retryCount:2,pauseOnFailurePercent:10,auditRequired:true},


    energy:{managedSites:6,totalCapacityKw:2130,safetyHeadroomKw:170,activePolicies:5,demandResponseSites:4,setupIssues:1},
    energySites:[
      {id:'ENG-SITE-001',site:'Yerevan Mall EV Station',companyId:'CMP-001',countryCode:'AM',capacityKw:500,buildingReserveKw:90,safetyHeadroomKw:40,evBudgetKw:370,strategy:'Departure priority',peakLimitKw:430,solar:true,solarPeakKw:120,siteBattery:true,batteryCapacityKwh:500,batteryMaxDischargeKw:150,demandResponse:true,dynamicCost:true,status:'active',override:'Site policy',lastUpdated:'2026-08-17 10:32'},
      {id:'ENG-SITE-002',site:'Republic Square Charge Hub',companyId:'CMP-001',countryCode:'AM',capacityKw:420,buildingReserveKw:60,safetyHeadroomKw:35,evBudgetKw:325,strategy:'Balanced fairness',peakLimitKw:385,solar:false,solarPeakKw:0,siteBattery:false,batteryCapacityKwh:0,batteryMaxDischargeKw:0,demandResponse:true,dynamicCost:true,status:'active',override:'Market default',lastUpdated:'2026-08-17 09:48'},
      {id:'ENG-SITE-003',site:'Dalma Garden Station',companyId:'CMP-001',countryCode:'AM',capacityKw:360,buildingReserveKw:80,safetyHeadroomKw:30,evBudgetKw:250,strategy:'Cost optimized',peakLimitKw:320,solar:true,solarPeakKw:80,siteBattery:true,batteryCapacityKwh:240,batteryMaxDischargeKw:90,demandResponse:true,dynamicCost:true,status:'active',override:'Site policy',lastUpdated:'2026-08-17 09:12'},
      {id:'ENG-SITE-004',site:'Ararat Fleet Depot',companyId:'CMP-002',countryCode:'AM',capacityKw:480,buildingReserveKw:75,safetyHeadroomKw:35,evBudgetKw:370,strategy:'Fleet departure priority',peakLimitKw:440,solar:true,solarPeakKw:160,siteBattery:true,batteryCapacityKwh:620,batteryMaxDischargeKw:180,demandResponse:true,dynamicCost:true,status:'active',override:'Company policy',lastUpdated:'2026-08-17 08:56'},
      {id:'ENG-SITE-005',site:'Sevan Destination Hub',companyId:'CMP-003',countryCode:'AM',capacityKw:220,buildingReserveKw:40,safetyHeadroomKw:20,evBudgetKw:160,strategy:'Balanced fairness',peakLimitKw:200,solar:true,solarPeakKw:55,siteBattery:false,batteryCapacityKwh:0,batteryMaxDischargeKw:0,demandResponse:false,dynamicCost:false,status:'active',override:'Market default',lastUpdated:'2026-08-16 17:31'},
      {id:'ENG-SITE-006',site:'North Route Tbilisi Hub',companyId:'CMP-004',countryCode:'GE',capacityKw:150,buildingReserveKw:35,safetyHeadroomKw:10,evBudgetKw:105,strategy:'Not configured',peakLimitKw:140,solar:false,solarPeakKw:0,siteBattery:false,batteryCapacityKwh:0,batteryMaxDischargeKw:0,demandResponse:false,dynamicCost:false,status:'setup',override:'Setup required',lastUpdated:'2026-08-17 09:56'}
    ],
    energyPriorityRules:[
      {id:'EPR-001',name:'Departure urgency',signal:'Minutes to scheduled departure',weight:35,appliesTo:'Fleet vehicles',status:'active',detail:'Vehicles departing sooner receive additional charging priority.'},
      {id:'EPR-002',name:'Battery deficit',signal:'Target SOC minus current SOC',weight:25,appliesTo:'All managed vehicles',status:'active',detail:'Vehicles with the largest battery deficit receive proportionally more allocation.'},
      {id:'EPR-003',name:'Fleet service priority',signal:'Fleet / route priority',weight:20,appliesTo:'Corporate fleet',status:'active',detail:'Operationally critical routes can receive a controlled priority boost.'},
      {id:'EPR-004',name:'Electricity cost signal',signal:'Current / forecast energy price',weight:10,appliesTo:'Flexible sessions',status:'active',detail:'Flexible charging can shift away from expensive grid periods.'},
      {id:'EPR-005',name:'Renewable availability',signal:'Solar + site battery availability',weight:10,appliesTo:'DER-enabled sites',status:'active',detail:'Charging can increase when local renewable or stored energy is available.'}
    ],
    demandResponsePrograms:[
      {id:'DR-001',name:'Armenia Peak Reduction',scope:'Managed Armenia sites',trigger:'Utility curtailment request',response:'Reduce EV budget while preserving safety and emergency reservations',maxReductionPercent:25,minimumNoticeMinutes:10,status:'active',lastEvent:'No active event'},
      {id:'DR-002',name:'Georgia Utility Response',scope:'North Route · Georgia',trigger:'Utility curtailment request',response:'Not configured',maxReductionPercent:0,minimumNoticeMinutes:0,status:'setup',lastEvent:'Not configured'}
    ],
    energyPolicies:{defaultStrategy:'Balanced fairness',safetyHeadroomPercent:10,minimumSiteReserveKw:20,peakProtection:true,buildingLoadCoordination:true,solarOptimization:true,siteBatteryOptimization:true,dynamicCostOptimization:true,demandResponse:true,phaseBalancing:true,departurePriority:true,allowSiteOverrides:true,requireAudit:true,simulationMode:true},
    ai:{activeModels:4,automationRules:6,openApprovals:2,forecastHealth:96,lastEvaluation:'10:48'},
    aiModels:[
      {id:'AI-DMD-01',name:'Charging Demand Forecast',capability:'Demand forecasting',version:'1.6',scope:'Armenia · Network',owner:'Energy Analytics',status:'active',mode:'Advisory',confidence:94,metricLabel:'MAPE',metricValue:'8.7%',lastEvaluated:'2026-08-17 10:42',lastRun:'2026-08-17 10:45',dataWindow:'90 days',outputs:'Hourly site demand · 24h / 7d horizon',notes:'Prototype configuration representing demand prediction described in the product documentation. No real model inference runs in this UI.'},
      {id:'AI-AVL-01',name:'Charger Availability Predictor',capability:'Availability prediction',version:'1.3',scope:'Public network · Armenia',owner:'Network Analytics',status:'active',mode:'Advisory',confidence:91,metricLabel:'Precision',metricValue:'91%',lastEvaluated:'2026-08-17 10:30',lastRun:'2026-08-17 10:44',dataWindow:'60 days',outputs:'30 / 60 / 120 min availability probability',notes:'Produces advisory availability forecasts for discovery and reservation planning.'},
      {id:'AI-MNT-02',name:'Predictive Maintenance Risk',capability:'Failure prediction',version:'2.1',scope:'DC chargers · Armenia',owner:'Maintenance Engineering',status:'active',mode:'Approval required',confidence:88,metricLabel:'Recall',metricValue:'88%',lastEvaluated:'2026-08-17 09:58',lastRun:'2026-08-17 10:40',dataWindow:'180 days',outputs:'Component risk score · probable cause · recommended inspection',notes:'Recommendations can create maintenance review items but cannot autonomously close, disable or repair equipment.'},
      {id:'AI-ENG-01',name:'Site Energy Forecast',capability:'Energy forecasting',version:'1.4',scope:'Managed sites · Armenia',owner:'Energy Operations',status:'active',mode:'Advisory',confidence:96,metricLabel:'MAPE',metricValue:'6.2%',lastEvaluated:'2026-08-17 10:12',lastRun:'2026-08-17 10:46',dataWindow:'120 days',outputs:'Grid load · solar contribution · site battery demand',notes:'Advisory forecast for energy optimization and peak planning.'},
      {id:'AI-REV-01',name:'Revenue Anomaly Detection',capability:'Revenue anomaly detection',version:'0.9',scope:'Payments · Armenia',owner:'Finance Controls',status:'review',mode:'Approval required',confidence:82,metricLabel:'Review precision',metricValue:'82%',lastEvaluated:'2026-08-16 18:20',lastRun:'2026-08-17 09:20',dataWindow:'120 days',outputs:'Unusual payment · settlement · revenue-loss signals',notes:'Under review. Findings are routed to Finance; no autonomous refunds, settlements or payment blocking.'},
      {id:'AI-SCH-01',name:'Charging & Reservation Schedule Optimizer',capability:'Schedule optimization',version:'0.8',scope:'Fleet + reservation planning · Armenia',owner:'Optimization Lab',status:'review',mode:'Approval required',confidence:87,metricLabel:'On-time readiness',metricValue:'94%',lastEvaluated:'2026-08-17 10:05',lastRun:'2026-08-17 10:38',dataWindow:'120 days',outputs:'Recommended charging windows · charger assignments · reservation alternatives',notes:'Optimizes charging and reservation schedules while preserving departure, connector and site-capacity constraints.'},
      {id:'AI-SUP-01',name:'Support & Technical Assistant',capability:'Support assistance',version:'0.6',scope:'Customer support + technician knowledge',owner:'Support Operations',status:'review',mode:'Advisory',confidence:89,metricLabel:'Answer acceptance',metricValue:'89%',lastEvaluated:'2026-08-16 16:20',lastRun:'2026-08-17 10:28',dataWindow:'Approved knowledge base',outputs:'Case summary · troubleshooting steps · escalation recommendation',notes:'Advisory assistant only; cannot execute charger commands or financial actions.'},
      {id:'AI-SITE-01',name:'Expansion Recommendation',capability:'Site recommendation',version:'0.7',scope:'Planning sandbox',owner:'Network Planning',status:'draft',mode:'Advisory',confidence:0,metricLabel:'Validation',metricValue:'Not evaluated',lastEvaluated:'Never',lastRun:'Never',dataWindow:'Not configured',outputs:'Candidate areas for new charger capacity',notes:'Draft planning configuration only.'}
    ],
    aiForecasts:[
      {id:'AIF-001',modelId:'AI-DMD-01',title:'Yerevan evening demand',horizon:'Today · 18:00–22:00',value:'1.42 MWh',delta:'+18% vs typical Monday',confidence:94,severity:'warning',detail:'Demand is expected to peak near 19:30 across Yerevan public DC sites.'},
      {id:'AIF-002',modelId:'AI-AVL-01',title:'Ultra-fast availability',horizon:'Next 60 min',value:'73%',delta:'Network probability',confidence:91,severity:'info',detail:'Most HC-300 connectors are expected to remain available outside the central Yerevan cluster.'},
      {id:'AIF-003',modelId:'AI-MNT-02',title:'Maintenance risk candidates',horizon:'Next 7 days',value:'3 chargers',delta:'2 require review',confidence:88,severity:'warning',detail:'Two connector-lock assemblies and one cooling subsystem exceed the configured review threshold.'},
      {id:'AIF-004',modelId:'AI-ENG-01',title:'Peak grid draw',horizon:'Today',value:'612 kW',delta:'At 19:30',confidence:96,severity:'info',detail:'Forecast remains below aggregated managed-site capacity with 88 kW estimated headroom.'}
    ],
    automationRules:[
      {id:'AUT-001',name:'Pre-stage Fleet Charging Priority',category:'Energy',trigger:'Departure risk predicted < 90% readiness',action:'Recommend priority increase to Fleet Manager',scope:'Corporate depots',approval:'Advisory only',status:'active',lastTriggered:'Today · 08:12',runs30d:46,guardrail:'Never changes charger power without Fleet Manager approval',modelId:'AI-DMD-01'},
      {id:'AUT-002',name:'Create Maintenance Review',category:'Maintenance',trigger:'Failure risk ≥ 85%',action:'Create maintenance review item with probable cause',scope:'DC chargers · Armenia',approval:'Automatic low-risk',status:'active',lastTriggered:'Today · 09:41',runs30d:12,guardrail:'Does not disable charger or create final technician assignment',modelId:'AI-MNT-02'},
      {id:'AUT-003',name:'Suggest Reservation Alternative',category:'Customer experience',trigger:'Reserved charger predicted unavailable',action:'Recommend compatible alternative charger',scope:'Driver reservations · Armenia',approval:'Automatic low-risk',status:'active',lastTriggered:'Today · 10:03',runs30d:124,guardrail:'Customer must confirm any reservation modification',modelId:'AI-AVL-01'},
      {id:'AUT-004',name:'Peak Load Advisory',category:'Energy',trigger:'Forecast site load > 90% capacity',action:'Notify Operator and Fleet Manager with mitigation suggestion',scope:'Managed sites',approval:'Automatic low-risk',status:'active',lastTriggered:'Yesterday · 19:06',runs30d:18,guardrail:'No autonomous load shedding or session stopping',modelId:'AI-ENG-01'},
      {id:'AUT-005',name:'Revenue Anomaly Review',category:'Finance',trigger:'Anomaly score ≥ configured threshold',action:'Create Finance review item',scope:'Payments + settlements',approval:'Approval required',status:'review',lastTriggered:'Yesterday · 15:22',runs30d:7,guardrail:'Never refunds, blocks payment or changes settlement automatically',modelId:'AI-REV-01'},
      {id:'AUT-007',name:'Safe Charger Recovery Proposal',category:'Maintenance',trigger:'Known recoverable fault signature detected',action:'Recommend approved remote recovery playbook',scope:'Supported charger models',approval:'Automatic low-risk',status:'active',lastTriggered:'Today · 09:54',runs30d:21,guardrail:'Only allowlisted stateless recovery commands; no autonomous session stop, connector disable, cable release or safety bypass',modelId:'AI-MNT-02'},
      {id:'AUT-008',name:'Schedule Optimization Review',category:'Operations',trigger:'Fleet readiness or reservation conflict predicted',action:'Create optimized charging/reservation schedule for human approval',scope:'Managed fleet + reservation planning',approval:'Approval required',status:'active',lastTriggered:'Today · 08:36',runs30d:38,guardrail:'Schedule changes are not applied until the owning Fleet/Operator workflow approves them',modelId:'AI-SCH-01'},
      {id:'AUT-009',name:'Support Case Assist',category:'Customer experience',trigger:'Support or technical case opened',action:'Draft case summary and approved troubleshooting guidance',scope:'Customer support + technician cases',approval:'Automatic low-risk',status:'active',lastTriggered:'Today · 10:11',runs30d:173,guardrail:'No remote charger commands, refunds or account changes; agent remains responsible for final response',modelId:'AI-SUP-01'},
      {id:'AUT-006',name:'Tariff Optimization Proposal',category:'Commercial',trigger:'Demand-cost variance exceeds threshold',action:'Draft tariff recommendation',scope:'Armenia public charging',approval:'Approval required',status:'paused',lastTriggered:'2026-08-12 · 17:40',runs30d:3,guardrail:'Tariff publication always requires an administrator',modelId:'AI-DMD-01'}
    ],
    aiApprovals:[
      {id:'AIA-001',type:'Maintenance recommendation',title:'Review connector-lock risk on AM-YER-HC300-009',modelId:'AI-MNT-02',confidence:91,requestedAt:'10:40',owner:'Maintenance Engineering',status:'review',detail:'Repeated lock-current variance and recovery retries triggered the predictive maintenance threshold. Review before creating a maintenance ticket.'},
      {id:'AIA-002',type:'Finance anomaly',title:'Review settlement variance cluster',modelId:'AI-REV-01',confidence:84,requestedAt:'09:20',owner:'Finance Controls',status:'review',detail:'Three partner settlement records differ from their recent pattern. No payment or settlement action has been taken automatically.'}
    ],
    aiPolicies:{minimumConfidence:80,highImpactApproval:true,allowAutonomousLowRisk:true,allowTariffPublish:false,allowSessionStop:false,allowChargerDisable:false,allowRefund:false,allowMaintenanceReviewCreation:true,allowSafeRemoteRecovery:true,modelEvaluationDays:30,maxAutomaticActionsPerHour:50,retainDecisionAuditDays:365,requireAudit:true,explainRecommendations:true,driftAlerting:true},
    reportDefinitions:[
      {id:'RPT-001',name:'Platform Executive Summary',category:'Executive',scope:'Platform · All companies',scopeLevel:'platform',companyIds:[],owner:'Platform Administration',schedule:'Every Monday · 08:00',format:'PDF + CSV',status:'active',lastRun:'2026-08-17 08:00',nextRun:'2026-08-24 08:00',dataDomains:['Companies','Sites','Sessions','Energy','Revenue','Maintenance'],description:'High-level platform administration summary across organizational, operational and commercial domains.'},
      {id:'RPT-002',name:'Charger Reliability & Utilization',category:'Operations',scope:'Platform · Charging network',scopeLevel:'platform',companyIds:[],owner:'Network Analytics',schedule:'Daily · 07:00',format:'CSV',status:'active',lastRun:'2026-08-17 07:00',nextRun:'2026-08-18 07:00',dataDomains:['Charger uptime','Successful sessions','Failed sessions','Energy delivered','Utilization'],description:'Advanced charger reliability and utilization report aligned to platform reporting requirements.'},
      {id:'RPT-003',name:'Financial Performance & Profitability',category:'Finance',scope:'VoltDrive Armenia',scopeLevel:'company',companyIds:['CMP-001'],owner:'Finance',schedule:'Daily close · 08:30',format:'CSV + XLSX',status:'active',lastRun:'2026-08-17 08:30',nextRun:'2026-08-18 08:30',dataDomains:['Revenue','Electricity cost','Taxes','Commissions','Profitability','Settlements'],description:'Revenue, cost, tax, commission and profitability view by company, site and charger.'},
      {id:'RPT-004',name:'Reservation & Parking Performance',category:'Customer operations',scope:'Public charging · Armenia',scopeLevel:'company',companyIds:['CMP-001'],owner:'Customer Operations',schedule:'Weekly · Monday',format:'CSV',status:'active',lastRun:'2026-08-17 08:15',nextRun:'2026-08-24 08:15',dataDomains:['Reservations','Cancellations','No-shows','Parking bays','Idle fees'],description:'Reservation, cancellation, no-show and parking-bay utilization reporting.'},
      {id:'RPT-005',name:'Maintenance & SLA Performance',category:'Maintenance',scope:'Managed chargers · Armenia',scopeLevel:'company',companyIds:['CMP-001'],owner:'Maintenance Engineering',schedule:'Weekly · Monday',format:'PDF + CSV',status:'active',lastRun:'2026-08-17 08:20',nextRun:'2026-08-24 08:20',dataDomains:['Maintenance tickets','Repair time','Repeat failures','SLA','Parts'],description:'Maintenance execution, SLA, repair duration and repeated-failure analysis.'},
      {id:'RPT-006',name:'Fleet & Energy Cost Review',category:'Fleet & Energy',scope:'Corporate fleets · Armenia',scopeLevel:'company',companyIds:['CMP-001'],owner:'Fleet Operations',schedule:'Monthly',format:'CSV',status:'active',lastRun:'2026-08-01 09:00',nextRun:'2026-09-01 09:00',dataDomains:['Fleet charging cost','Vehicle energy','Depot load','Peak demand','Renewable energy'],description:'Fleet charging cost, depot load and renewable-energy reporting.'},
      {id:'RPT-007',name:'Security & Access Compliance',category:'Security',scope:'Platform',scopeLevel:'platform',companyIds:[],owner:'Platform Security',schedule:'Weekly · Friday',format:'PDF + CSV',status:'active',lastRun:'2026-08-14 17:00',nextRun:'2026-08-21 17:00',dataDomains:['Users','Roles','2FA','Certificates','Blocked identities','Security events'],description:'Administrative access, MFA, certificate lifecycle and security event compliance report.'},
      {id:'RPT-009',name:'Customer Activity & Network Demand',category:'Customer operations',scope:'Platform · All companies',scopeLevel:'platform',companyIds:[],owner:'Customer Analytics',schedule:'Weekly · Tuesday',format:'CSV + XLSX',status:'active',lastRun:'2026-08-12 08:00',nextRun:'2026-08-19 08:00',dataDomains:['Customer activity','Busy periods','Inactive periods','Sessions by hour','Repeat customers'],description:'Customer activity and time-of-day demand reporting, including busy and inactive charging periods.'},
      {id:'RPT-010',name:'Carbon & Renewable Energy Impact',category:'Fleet & Energy',scope:'Platform · Managed energy sites',scopeLevel:'platform',companyIds:[],owner:'Energy Analytics',schedule:'Monthly',format:'PDF + CSV',status:'active',lastRun:'2026-08-01 09:15',nextRun:'2026-09-01 09:15',dataDomains:['Carbon information','Renewable energy','Solar contribution','Site battery energy','Grid energy'],description:'Carbon and renewable-energy reporting for managed charging and fleet operations.'},
      {id:'RPT-008',name:'Integration & Reconciliation Health',category:'Integrations',scope:'Production integrations',scopeLevel:'platform',companyIds:[],owner:'Platform Integrations',schedule:'Daily · 09:00',format:'CSV',status:'active',lastRun:'2026-08-17 09:00',nextRun:'2026-08-18 09:00',dataDomains:['ERP sync','API delivery','Webhooks','Mappings','Reconciliation'],description:'ERP/API synchronization health, mapping review and financial reconciliation status.'}
    ],
    reportRuns:[
      {id:'RUN-0268',reportId:'RPT-001',runAt:'2026-08-17 08:00',period:'Week to date',format:'PDF + CSV',rows:1,status:'ready',generatedBy:'Scheduler',summary:'4 companies · 28 sites · platform administration snapshot'},
      {id:'RUN-0267',reportId:'RPT-003',runAt:'2026-08-17 08:30',period:'2026-08-16 daily close',format:'CSV + XLSX',rows:342,status:'ready',generatedBy:'Scheduler',summary:'Finance close report generated after ERP reconciliation'},
      {id:'RUN-0266',reportId:'RPT-002',runAt:'2026-08-17 07:00',period:'Previous 24 hours',format:'CSV',rows:86,status:'ready',generatedBy:'Scheduler',summary:'Charger reliability and utilization dataset'},
      {id:'RUN-0265',reportId:'RPT-007',runAt:'2026-08-14 17:00',period:'Previous 7 days',format:'PDF + CSV',rows:74,status:'ready',generatedBy:'Scheduler',summary:'Access, certificate and security compliance snapshot'},
      {id:'RUN-0264',reportId:'RPT-008',runAt:'2026-08-17 09:00',period:'Current production state',format:'CSV',rows:21,status:'review',generatedBy:'Scheduler',summary:'One 1C mapping remains under review'}
    ],
    reportingPolicies:{auditRetentionDays:365,reportRetentionDays:180,immutableAudit:true,requirePrivilegedReason:true,requireAuditExportReason:true,scheduledDelivery:true,includePiiByDefault:false,defaultFormat:'CSV',timezone:'Asia/Yerevan',exportWatermark:true},
    platformSettings:{
      general:{platformDisplayName:'VoltDrive',legalPlatformName:'VoltDrive Platform',environment:'Production',defaultMarket:'AM',defaultCurrency:'AMD',defaultTimezone:'Asia/Yerevan',defaultLocale:'en-AM',primaryLanguage:'English',dateFormat:'DD.MM.YYYY',distanceUnit:'km'},
      charging:{defaultChargeLimit:80,reservationGraceMinutes:10,defaultReservationMinutes:60,idleGraceMinutes:5,autoAssignCharger:true,allowWaitingList:true,allowReservationModification:true,requireVehicleSelection:true,requirePaymentPreauth:true},
      communications:{push:true,email:true,sms:false,reservationReminderMinutes:30,criticalPushRequired:true,receiptDelivery:'Email + App',supportEscalationMinutes:15},
      numbering:{sessionPrefix:'CS',reservationPrefix:'RSV',invoicePrefix:'INV',maintenancePrefix:'MT',settlementPrefix:'SET',sequencePadding:7,resetPolicy:'Never'},
      retention:{telemetryDays:90,sessionHistoryDays:2555,paymentRecordsDays:2555,notificationDays:180,operationalLogsDays:365,auditDays:365},
      features:{reservations:true,waitingList:true,wallet:true,subscriptions:true,roaming:true,plugAndCharge:true,corporateFleet:true,homeCharging:true,aiRecommendations:true,parkingManagement:true},
      support:{supportEmail:'Not configured',supportPhone:'Not configured',emergencyContact:'Not configured',legalTermsProfile:'Armenia driver terms',privacyProfile:'Platform privacy · draft',receiptSenderName:'VoltDrive',maintenanceWindow:'Sunday · 03:00–04:00'}
    },
    audit:[
      {id:'AUD-101',date:'2026-08-17',time:'10:18',icon:'♙',module:'Users & Access',companyId:'CMP-001',actor:'Ani Grigoryan',severity:'warning',title:'Role approval requested',detail:'Mariam Hovsepyan · Operator Supervisor',source:'Admin Portal'},
      {id:'AUD-102',date:'2026-08-17',time:'09:35',icon:'⇄',module:'ERP & Integrations',companyId:'CMP-001',actor:'Ani Grigoryan',severity:'info',title:'ERP mapping updated',detail:'Settlement export · 1C ERP Armenia',source:'Admin Portal'},
      {id:'AUD-103',date:'2026-08-17',time:'09:12',icon:'¤',module:'Tariffs & Pricing',companyId:'CMP-001',actor:'Ani Grigoryan',severity:'info',title:'Tariff published',detail:'Yerevan DC Peak · v3',source:'Admin Portal'},
      {id:'AUD-104',date:'2026-08-17',time:'08:54',icon:'◇',module:'Security & Certificates',companyId:'',actor:'Platform Security',severity:'warning',title:'Certificate inventory checked',detail:'2 certificates require renewal',source:'Security Service'},
      {id:'AUD-105',date:'2026-08-17',time:'08:22',icon:'▣',module:'Companies',companyId:'CMP-002',actor:'Ani Grigoryan',severity:'info',title:'Company configuration changed',detail:'Ararat Mobility · billing profile',source:'Admin Portal'},
      {id:'AUD-106',date:'2026-08-16',time:'18:42',icon:'▤',module:'Payments',companyId:'CMP-001',actor:'Lusine Harutyunyan',severity:'info',title:'Payment policy reviewed',detail:'Preauthorization and refund controls · VoltDrive Armenia',source:'Admin Portal'},
      {id:'AUD-107',date:'2026-08-16',time:'17:12',icon:'⇄',module:'ERP & Integrations',companyId:'CMP-001',actor:'Integration Service',severity:'warning',title:'ERP acknowledgement timeout recovered',detail:'1C ERP Armenia · automatic retry succeeded',source:'Integration Service'},
      {id:'AUD-108',date:'2026-08-16',time:'15:22',icon:'✦',module:'AI & Automation',companyId:'',actor:'AI Governance',severity:'warning',title:'Finance anomaly sent for review',detail:'Settlement variance cluster · no autonomous payment action',source:'AI Governance'},
      {id:'AUD-109',date:'2026-08-15',time:'11:04',icon:'↻',module:'Firmware',companyId:'CMP-001',actor:'Platform Engineering',severity:'info',title:'Firmware campaign approved',detail:'FW-2026.08 · staged rollout',source:'Admin Portal'},
      {id:'AUD-110',date:'2026-08-14',time:'16:30',icon:'◇',module:'Security & Certificates',companyId:'',actor:'Platform Security',severity:'critical',title:'Compromised RFID blocked',detail:'RFID-88421 · credential deny-list entry',source:'Security Service'}
    ]
  };
  function merge(base,saved){
    if(Array.isArray(base)) return Array.isArray(saved)?saved:base;
    if(base&&typeof base==='object'){
      const out={...base};
      if(saved&&typeof saved==='object'&&!Array.isArray(saved)) Object.keys(saved).forEach(k=>{out[k]=k in base?merge(base[k],saved[k]):saved[k]});
      return out;
    }
    return saved===undefined?base:saved;
  }
  let state;
  try{state=merge(seed,JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'));}catch(e){state=JSON.parse(JSON.stringify(seed));}
  state.currentSession={...seed.currentSession,...(state.currentSession||{})};
  const locationSeedById=Object.fromEntries(seed.locations.map(item=>[item.id,item]));
  state.locations=(Array.isArray(state.locations)?state.locations:seed.locations).map((item,index)=>({id:item.id||`LOC-${String(index+1).padStart(3,'0')}`,name:'Charging location',companyId:'CMP-001',countryCode:'AM',status:'setup',siteType:'Charging site',...(locationSeedById[item.id]||{}),...item}));
  seed.locations.forEach(item=>{if(!state.locations.some(x=>x.id===item.id))state.locations.push(JSON.parse(JSON.stringify(item)));});
  const chargerSeedById=Object.fromEntries(seed.chargers.map(item=>[item.id,item]));
  state.chargers=(Array.isArray(state.chargers)?state.chargers:seed.chargers).map((item,index)=>({id:item.id||`CHG-${String(index+1).padStart(3,'0')}`,locationId:'',companyId:'CMP-001',modelId:'',status:'setup',...(chargerSeedById[item.id]||{}),...item}));
  seed.chargers.forEach(item=>{if(!state.chargers.some(x=>x.id===item.id))state.chargers.push(JSON.parse(JSON.stringify(item)));});
  const legacySiteIdMap={'ENG-SITE-001':'LOC-AM-YER-MALL','ENG-SITE-002':'LOC-AM-YER-REPUBLIC','ENG-SITE-003':'LOC-AM-YER-DALMA','ENG-SITE-004':'LOC-AM-ARARAT-DEPOT','ENG-SITE-005':'LOC-AM-SEVAN','ENG-SITE-006':'LOC-GE-TBILISI','SITE-GYUMRI':'LOC-AM-GYUMRI'};
  const userSeedById=Object.fromEntries(seed.userDirectory.map(user=>[user.id,user]));
  state.userDirectory=(Array.isArray(state.userDirectory)?state.userDirectory:seed.userDirectory).map(user=>{
    const seeded=userSeedById[user.id]||{};
    const fallbackCompany=user.companyId?[user.companyId]:[];
    const fallbackCountry=fallbackCompany.map(id=>state.companies?.find(c=>c.id===id)?.countryCode).filter(Boolean);
    const accessScope=user.accessScope||seeded.accessScope||(String(user.scope||'').toLowerCase().includes('platform')?{level:'platform',companyIds:[],countryCodes:[],siteIds:[],chargerIds:[]}:{level:'company',companyIds:fallbackCompany,countryCodes:fallbackCountry,siteIds:[],chargerIds:[]});
    return {...seeded,...user,accessScope:{level:accessScope.level||'company',companyIds:Array.isArray(accessScope.companyIds)?accessScope.companyIds:fallbackCompany,countryCodes:Array.isArray(accessScope.countryCodes)?accessScope.countryCodes:fallbackCountry,siteIds:Array.isArray(accessScope.siteIds)?[...new Set(accessScope.siteIds.map(id=>legacySiteIdMap[id]||id))]:[],chargerIds:Array.isArray(accessScope.chargerIds)?accessScope.chargerIds:[]}};
  });
  // System role and permission-catalog migration: preserve saved customizations while adding newly introduced platform permissions.
  const seedRoleById=Object.fromEntries(seed.roles.map(role=>[role.id,role]));
  state.roles=(Array.isArray(state.roles)?state.roles:seed.roles).map(role=>{const seeded=seedRoleById[role.id];if(!seeded)return role;const permissions=seeded.permissions.includes('*')?['*']:[...new Set([...(seeded.permissions||[]),...(role.permissions||[])])];return {...seeded,...role,permissions};});
  seed.roles.forEach(role=>{if(!state.roles.some(x=>x.id===role.id))state.roles.push(JSON.parse(JSON.stringify(role)));});
  const savedPermissionGroups=Array.isArray(state.permissionCatalog)?state.permissionCatalog:[];
  state.permissionCatalog=seed.permissionCatalog.map(group=>{const saved=savedPermissionGroups.find(x=>x.group===group.group);const byId=Object.fromEntries((saved?.items||[]).map(item=>[item.id,item]));return {group:group.group,items:group.items.map(item=>({...item,...(byId[item.id]||{})})).concat((saved?.items||[]).filter(item=>!group.items.some(seedItem=>seedItem.id===item.id)))};});
  savedPermissionGroups.filter(group=>!state.permissionCatalog.some(x=>x.group===group.group)).forEach(group=>state.permissionCatalog.push(group));
  if(!Array.isArray(state.integrations)) state.integrations=JSON.parse(JSON.stringify(seed.integrations));
  seed.integrations.forEach(item=>{if(!state.integrations.some(x=>x.id===item.id))state.integrations.push(JSON.parse(JSON.stringify(item)));});
  const countrySeedByCode=Object.fromEntries(seed.countries.map(c=>[c.code,c]));
  state.countries=(Array.isArray(state.countries)?state.countries:[]).map(country=>({
    ...(countrySeedByCode[country.code]||{locale:'en-US',language:'English',invoiceProfile:'Not configured',legalTerms:'Not configured',paymentRegion:'Not configured',marketStatus:'setup',companies:0,sites:0,lastUpdated:'2026-08-17 11:19'}),
    ...country
  }));
  const currencySeedByCode=Object.fromEntries(seed.currencies.map(c=>[c.code,c]));
  state.currencies=(Array.isArray(state.currencies)?state.currencies:seed.currencies).map(currency=>({
    ...(currencySeedByCode[currency.code]||{name:currency.code||'Currency',symbol:'¤',decimals:2,rateMode:'Manual',rateToBase:1,settlement:false,charging:false,status:'setup',lastUpdated:'2026-08-17 11:19'}),
    ...currency
  }));
  seed.currencies.forEach(currency=>{if(!state.currencies.some(c=>c.code===currency.code))state.currencies.push({...currency});});
  const taxSeedById=Object.fromEntries(seed.taxProfiles.map(profile=>[profile.id,profile]));
  state.taxProfiles=(Array.isArray(state.taxProfiles)?state.taxProfiles:seed.taxProfiles).map((profile,index)=>({
    id:profile.id||`TAX-${String(index+1).padStart(3,'0')}`,name:'Untitled tax profile',countryCode:'AM',taxType:'VAT',rate:null,priceDisplay:'Tax exclusive',status:'draft',defaultForMarket:false,invoiceProfile:'Not configured',invoicePrefix:'',numberingRule:'Not configured',registrationSource:'Not configured',effectiveFrom:'Not configured',taxable:{energy:true,chargingMinute:true,connection:true,reservation:true,parking:true,idle:true},notes:'',lastUpdated:'2026-08-17 11:25',
    ...(taxSeedById[profile.id]||{}),...profile,taxable:{...((taxSeedById[profile.id]||{}).taxable||{}),...(profile.taxable||{})}
  }));
  seed.taxProfiles.forEach(profile=>{if(!state.taxProfiles.some(p=>p.id===profile.id))state.taxProfiles.push(JSON.parse(JSON.stringify(profile)));});
  const tariffSeedById=Object.fromEntries(seed.tariffProfiles.map(profile=>[profile.id,profile]));
  state.tariffProfiles=(Array.isArray(state.tariffProfiles)?state.tariffProfiles:seed.tariffProfiles).map((profile,index)=>({
    id:profile.id||`TAR-${String(index+1).padStart(3,'0')}`,name:'Untitled tariff',version:1,countryCode:'AM',currency:'AMD',companyId:'CMP-001',scopeType:'Market',scopeValue:'All eligible charging',scopeRefs:{locationIds:[],chargerIds:[],modelIds:[]},audience:'Driver',connectorClass:'All connectors',status:'draft',taxProfileId:'TAX-001',energyRate:0,minuteRate:0,connectionFee:0,reservationFee:0,parkingFee:0,idleFee:0,discountType:'None',discountValue:0,scheduleMode:'Always',scheduleDays:'Every day',scheduleStart:'00:00',scheduleEnd:'23:59',effectiveFrom:'2026-08-17',effectiveTo:'',notes:'',lastUpdated:'2026-08-17 11:30',
    ...(tariffSeedById[profile.id]||{}),...profile,
    scopeRefs:{locationIds:Array.isArray(profile.scopeRefs?.locationIds)?profile.scopeRefs.locationIds:[],chargerIds:Array.isArray(profile.scopeRefs?.chargerIds)?profile.scopeRefs.chargerIds:[],modelIds:Array.isArray(profile.scopeRefs?.modelIds)?profile.scopeRefs.modelIds:[]}
  }));
  seed.tariffProfiles.forEach(profile=>{if(!state.tariffProfiles.some(p=>p.id===profile.id))state.tariffProfiles.push(JSON.parse(JSON.stringify(profile)));});
  const tariffScopeRefsById={'TAR-002':{locationIds:['LOC-AM-YER-MALL','LOC-AM-YER-REPUBLIC','LOC-AM-YER-DALMA'],chargerIds:[],modelIds:[]},'TAR-006':{locationIds:[],chargerIds:[],modelIds:['MODEL-HC300']}};
  state.tariffProfiles.forEach(t=>{const refs=tariffScopeRefsById[t.id];if(refs&&!(t.scopeRefs?.locationIds?.length||t.scopeRefs?.chargerIds?.length||t.scopeRefs?.modelIds?.length))t.scopeRefs=JSON.parse(JSON.stringify(refs));});
  const paymentProviderSeedById=Object.fromEntries(seed.paymentProviders.map(provider=>[provider.id,provider]));
  state.paymentProviders=(Array.isArray(state.paymentProviders)?state.paymentProviders:seed.paymentProviders).map((provider,index)=>({
    id:provider.id||`PAY-${String(index+1).padStart(3,'0')}`,name:'Untitled payment provider',providerType:'Payment gateway',companyId:'CMP-001',countryCode:'AM',mode:'Sandbox',status:'setup',methods:['Bank cards'],currencies:['AMD'],preauthorization:true,preauthRule:'Not configured',captureRule:'Not configured',refunds:false,partialRefunds:false,tokenization:'Not configured',authentication:'Not configured',settlementCurrency:'AMD',settlementSchedule:'Not configured',merchantAccount:'Not configured',lastSync:'Never',notes:'',
    ...(paymentProviderSeedById[provider.id]||{}),...provider,methods:Array.isArray(provider.methods)?provider.methods:[],currencies:Array.isArray(provider.currencies)?provider.currencies:[]
  }));
  seed.paymentProviders.forEach(provider=>{if(!state.paymentProviders.some(p=>p.id===provider.id))state.paymentProviders.push(JSON.parse(JSON.stringify(provider)));});
  if(!Array.isArray(state.paymentMethods)) state.paymentMethods=JSON.parse(JSON.stringify(seed.paymentMethods));
  state.paymentPolicies={
    preauthorization:{...seed.paymentPolicies.preauthorization,...(state.paymentPolicies?.preauthorization||{})},
    wallet:{...seed.paymentPolicies.wallet,...(state.paymentPolicies?.wallet||{})},
    refunds:{...seed.paymentPolicies.refunds,...(state.paymentPolicies?.refunds||{})},
    corporate:{...seed.paymentPolicies.corporate,...(state.paymentPolicies?.corporate||{})}
  };

  const transactionSeedById=Object.fromEntries(seed.paymentTransactions.map(item=>[item.id,item]));
  state.paymentTransactions=(Array.isArray(state.paymentTransactions)?state.paymentTransactions:seed.paymentTransactions).map((item,index)=>({id:item.id||`TXN-${String(index+1).padStart(6,'0')}`,companyId:'CMP-001',createdAt:'Never',sessionId:'',driver:'Unknown',amount:0,currency:'AMD',method:'Bank card',providerId:'',status:'pending',riskScore:0,riskStatus:'clear',reason:'',authRef:'',...(transactionSeedById[item.id]||{}),...item}));
  seed.paymentTransactions.forEach(item=>{if(!state.paymentTransactions.some(x=>x.id===item.id))state.paymentTransactions.push(JSON.parse(JSON.stringify(item)));});
  state.paymentRiskPolicies={...seed.paymentRiskPolicies,...(state.paymentRiskPolicies||{})};
  const planSeedById=Object.fromEntries(seed.subscriptionPlans.map(item=>[item.id,item]));
  state.subscriptionPlans=(Array.isArray(state.subscriptionPlans)?state.subscriptionPlans:seed.subscriptionPlans).map((item,index)=>({id:item.id||`PLAN-${String(index+1).padStart(3,'0')}`,companyId:'CMP-001',countryCode:'AM',name:'Charging plan',planType:'Subscription',audience:'Driver',billingCycle:'Monthly',price:0,currency:'AMD',includedKwh:0,discountPercent:0,reservationCredits:0,scope:'Company network',status:'draft',subscribers:0,notes:'',...(planSeedById[item.id]||{}),...item}));
  seed.subscriptionPlans.forEach(item=>{if(!state.subscriptionPlans.some(x=>x.id===item.id))state.subscriptionPlans.push(JSON.parse(JSON.stringify(item)));});
  const accountingEntrySeedById=Object.fromEntries(seed.accountingEntries.map(item=>[item.id,item]));
  state.accountingEntries=(Array.isArray(state.accountingEntries)?state.accountingEntries:seed.accountingEntries).map((item,index)=>({id:item.id||`JRN-${String(index+1).padStart(6,'0')}`,companyId:'CMP-001',date:today(),sourceType:'Manual journal',sourceId:'',description:'Accounting entry',debitAccount:'Not configured',creditAccount:'Not configured',amount:0,currency:'AMD',taxAmount:0,status:'review',externalRef:'',siteId:'',chargerId:'',site:'—',charger:'—',...(accountingEntrySeedById[item.id]||{}),...item}));
  seed.accountingEntries.forEach(item=>{if(!state.accountingEntries.some(x=>x.id===item.id))state.accountingEntries.push(JSON.parse(JSON.stringify(item)));});
  const accountingLocationRefsById={'JRN-000381':{siteId:'LOC-AM-YER-MALL',chargerId:'AM-YER-HC150-04'},'JRN-000380':{siteId:'LOC-AM-YER-MALL',chargerId:'AM-YER-HC150-04'},'JRN-000379':{siteId:'LOC-AM-YER-MALL',chargerId:'AM-YER-HC150-04'},'JRN-000378':{siteId:'LOC-AM-ARARAT-DEPOT',chargerId:''},'JRN-000377':{siteId:'LOC-AM-YER-MALL',chargerId:''},'JRN-000376':{siteId:'LOC-AM-SEVAN',chargerId:'SC-AC-08'}};
  state.accountingEntries.forEach(x=>{const ref=accountingLocationRefsById[x.id];if(ref&&!x.siteId)Object.assign(x,ref);if(x.id==='JRN-000377'&&x.sourceId==='SET-2407-01')x.sourceId='SET-2608-001';});
  const accountingMappingSeedById=Object.fromEntries(seed.accountingMappings.map(item=>[item.id,item]));
  state.accountingMappings=(Array.isArray(state.accountingMappings)?state.accountingMappings:seed.accountingMappings).map((item,index)=>({id:item.id||`MAP-ACC-${String(index+1).padStart(2,'0')}`,companyId:'CMP-001',source:'Business event',debitAccount:'Not configured',creditAccount:'Not configured',taxAccount:'—',status:'review',...(accountingMappingSeedById[item.id]||{}),...item}));
  seed.accountingMappings.forEach(item=>{if(!state.accountingMappings.some(x=>x.id===item.id))state.accountingMappings.push(JSON.parse(JSON.stringify(item)));});
  const financialRecSeedById=Object.fromEntries(seed.financialReconciliations.map(item=>[item.id,item]));
  state.financialReconciliations=(Array.isArray(state.financialReconciliations)?state.financialReconciliations:seed.financialReconciliations).map((item,index)=>({id:item.id||`FREC-${String(index+1).padStart(3,'0')}`,companyId:'CMP-001',period:today(),chargingAmount:0,providerAmount:0,bankAmount:0,difference:0,currency:'AMD',sessions:0,matchedTransactions:0,totalTransactions:0,status:'review',detail:'',...(financialRecSeedById[item.id]||{}),...item}));
  seed.financialReconciliations.forEach(item=>{if(!state.financialReconciliations.some(x=>x.id===item.id))state.financialReconciliations.push(JSON.parse(JSON.stringify(item)));});
  const profitabilitySeedById=Object.fromEntries(seed.profitabilityRecords.map(item=>[item.id,item]));
  state.profitabilityRecords=(Array.isArray(state.profitabilityRecords)?state.profitabilityRecords:seed.profitabilityRecords).map((item,index)=>({id:item.id||`PROF-${String(index+1).padStart(3,'0')}`,companyId:'CMP-001',scopeType:'Site',entityId:'',entity:'Charging site',revenue:0,electricityCost:0,paymentFees:0,partnerShare:0,taxes:0,currency:'AMD',...(profitabilitySeedById[item.id]||{}),...item}));
  seed.profitabilityRecords.forEach(item=>{if(!state.profitabilityRecords.some(x=>x.id===item.id))state.profitabilityRecords.push(JSON.parse(JSON.stringify(item)));});
  const profitabilityRefsById={'PROF-001':'LOC-AM-YER-MALL','PROF-002':'AM-YER-HC300-009','PROF-003':'LOC-AM-ARARAT-DEPOT','PROF-004':'LOC-AM-SEVAN'};
  state.profitabilityRecords.forEach(x=>{x.entityId=x.entityId||profitabilityRefsById[x.id]||'';});
  state.accountingPolicies={...seed.accountingPolicies,...(state.accountingPolicies||{})};

  const partnerSeedById=Object.fromEntries(seed.partners.map(partner=>[partner.id,partner]));
  state.partners=(Array.isArray(state.partners)?state.partners:seed.partners).map((partner,index)=>({
    id:partner.id||`PRT-${String(index+1).padStart(3,'0')}`,name:'Untitled partner',legalName:'',partnerType:'Property owner',companyId:'CMP-001',countryCode:'AM',currency:'AMD',scope:'Not configured',siteIds:[],linkedSites:0,contractId:`CTR-${String(index+1).padStart(3,'0')}`,contractStatus:'draft',contractStart:'',contractEnd:'',revenueModel:'Not configured',shareType:'Percent',shareValue:0,settlementCycle:'Monthly',settlementDay:'Not configured',taxTreatment:'Not configured',bankProfile:'Not configured',contactEmail:'',status:'setup',outstandingBalance:0,nextSettlement:'Not scheduled',lastSettlement:'Never',notes:'',
    ...(partnerSeedById[partner.id]||{}),...partner,siteIds:Array.isArray(partner.siteIds)?partner.siteIds:[]
  }));
  seed.partners.forEach(partner=>{if(!state.partners.some(p=>p.id===partner.id))state.partners.push(JSON.parse(JSON.stringify(partner)));});
  const partnerSiteRefsById={'PRT-001':['LOC-AM-YER-MALL'],'PRT-002':['LOC-AM-ARARAT-DEPOT'],'PRT-003':['LOC-AM-SEVAN'],'PRT-004':['LOC-GE-TBILISI']};
  state.partners.forEach(p=>{if(!p.siteIds?.length&&partnerSiteRefsById[p.id])p.siteIds=[...partnerSiteRefsById[p.id]];if(p.siteIds?.length)p.linkedSites=p.siteIds.length;});
  const settlementSeedById=Object.fromEntries(seed.settlementRuns.map(run=>[run.id,run]));
  state.settlementRuns=(Array.isArray(state.settlementRuns)?state.settlementRuns:seed.settlementRuns).map((run,index)=>({
    id:run.id||`SET-${String(index+1).padStart(3,'0')}`,partnerId:'PRT-001',companyId:'CMP-001',period:'Not configured',grossRevenue:0,taxAmount:0,paymentFees:0,adjustments:0,partnerShare:0,netPayable:0,currency:'AMD',reconciliationStatus:'review',settlementStatus:'draft',dueDate:'Not scheduled',paidAt:'',reference:'Draft',notes:'',
    ...(settlementSeedById[run.id]||{}),...run
  }));
  seed.settlementRuns.forEach(run=>{if(!state.settlementRuns.some(r=>r.id===run.id))state.settlementRuns.push(JSON.parse(JSON.stringify(run)));});
  state.settlementPolicies={...seed.settlementPolicies,...(state.settlementPolicies||{})};

  const roamingPartnerSeedById=Object.fromEntries(seed.roamingPartners.map(partner=>[partner.id,partner]));
  state.roamingPartners=(Array.isArray(state.roamingPartners)?state.roamingPartners:seed.roamingPartners).map((partner,index)=>({
    id:partner.id||`RMG-${String(index+1).padStart(3,'0')}`,name:'Untitled roaming partner',legalName:'',country:'Not configured',countryCode:'',partnerRole:'CPO + eMSP',protocol:'OCPI 2.2.1',connectionStatus:'setup',agreementStatus:'draft',agreementId:`RAG-${String(index+1).padStart(3,'0')}`,agreementStart:'',agreementEnd:'',operatorCode:'',partyId:'',businessCode:'',settlementCurrency:'AMD',commissionType:'Percent',commissionValue:0,fxRule:'Daily provider rate',settlementCycle:'Monthly',authorizationMode:'Real-time token authorization',reservations:false,locations:true,tariffs:true,availability:true,sessions:true,cdrs:true,remoteStart:false,locationsShared:0,tariffsShared:0,sessionsMtd:0,lastSync:'Never',latency:'—',endpoint:'Not configured',certificateStatus:'pending',status:'setup',notes:'',
    ...(roamingPartnerSeedById[partner.id]||{}),...partner
  }));
  seed.roamingPartners.forEach(partner=>{if(!state.roamingPartners.some(p=>p.id===partner.id))state.roamingPartners.push(JSON.parse(JSON.stringify(partner)));});
  const roamingSettlementSeedById=Object.fromEntries(seed.roamingSettlements.map(run=>[run.id,run]));
  state.roamingSettlements=(Array.isArray(state.roamingSettlements)?state.roamingSettlements:seed.roamingSettlements).map((run,index)=>({
    id:run.id||`RSET-${String(index+1).padStart(3,'0')}`,partnerId:'RMG-001',period:'Not configured',direction:'Not configured',sessions:0,grossAmount:0,commissionAmount:0,fxAdjustment:0,netAmount:0,currency:'AMD',reconciliationStatus:'review',settlementStatus:'draft',dueDate:'Not scheduled',reference:'Draft',notes:'',
    ...(roamingSettlementSeedById[run.id]||{}),...run
  }));
  seed.roamingSettlements.forEach(run=>{if(!state.roamingSettlements.some(r=>r.id===run.id))state.roamingSettlements.push(JSON.parse(JSON.stringify(run)));});
  const roamingDisputeSeedById=Object.fromEntries(seed.roamingDisputes.map(item=>[item.id,item]));
  state.roamingDisputes=(Array.isArray(state.roamingDisputes)?state.roamingDisputes:seed.roamingDisputes).map((item,index)=>({
    id:item.id||`RDIS-${String(index+1).padStart(3,'0')}`,partnerId:'RMG-001',sessionId:'',issue:'Roaming dispute',amount:0,currency:'AMD',openedAt:'2026-08-17',owner:'Roaming Operations',status:'open',detail:'',
    ...(roamingDisputeSeedById[item.id]||{}),...item
  }));
  seed.roamingDisputes.forEach(item=>{if(!state.roamingDisputes.some(d=>d.id===item.id))state.roamingDisputes.push(JSON.parse(JSON.stringify(item)));});
  state.roamingPolicies={...seed.roamingPolicies,...(state.roamingPolicies||{})};
  const enterpriseIntegrationSeedById=Object.fromEntries(seed.enterpriseIntegrations.map(item=>[item.id,item]));
  state.enterpriseIntegrations=(Array.isArray(state.enterpriseIntegrations)?state.enterpriseIntegrations:seed.enterpriseIntegrations).map((item,index)=>({
    id:item.id||`EINT-${String(index+1).padStart(3,'0')}`,name:'Untitled integration',system:'External system',category:'API',companyId:'CMP-001',countryCode:'AM',environment:'Setup',direction:'Outbound',transport:'Not configured',status:'setup',authMode:'Not configured',endpointLabel:'Not configured',schedule:'Not configured',lastSync:'Never',lastResult:'not-configured',recordsLastRun:0,latency:'—',objects:[],currency:'AMD',reconciliation:false,autoRetry:false,notes:'',
    ...(enterpriseIntegrationSeedById[item.id]||{}),...item,objects:Array.isArray(item.objects)?item.objects:[]
  }));
  seed.enterpriseIntegrations.forEach(item=>{if(!state.enterpriseIntegrations.some(x=>x.id===item.id))state.enterpriseIntegrations.push(JSON.parse(JSON.stringify(item)));});
  const mappingSeedById=Object.fromEntries(seed.integrationMappings.map(item=>[item.id,item]));
  state.integrationMappings=(Array.isArray(state.integrationMappings)?state.integrationMappings:seed.integrationMappings).map((item,index)=>({id:item.id||`MAP-${String(index+1).padStart(3,'0')}`,integrationId:'EINT-1C',source:'Source object',target:'Target object',scope:'Not configured',version:1,status:'draft',fields:0,lastChanged:'Never',owner:'Unassigned',...(mappingSeedById[item.id]||{}),...item}));
  seed.integrationMappings.forEach(item=>{if(!state.integrationMappings.some(x=>x.id===item.id))state.integrationMappings.push(JSON.parse(JSON.stringify(item)));});
  const jobSeedById=Object.fromEntries(seed.integrationSyncJobs.map(item=>[item.id,item]));
  state.integrationSyncJobs=(Array.isArray(state.integrationSyncJobs)?state.integrationSyncJobs:seed.integrationSyncJobs).map((item,index)=>({id:item.id||`JOB-${String(index+1).padStart(4,'0')}`,integrationId:'EINT-1C',jobType:'Sync',object:'Not configured',startedAt:'Never',duration:'—',records:0,status:'setup',message:'',...(jobSeedById[item.id]||{}),...item}));
  seed.integrationSyncJobs.forEach(item=>{if(!state.integrationSyncJobs.some(x=>x.id===item.id))state.integrationSyncJobs.push(JSON.parse(JSON.stringify(item)));});
  const errorSeedById=Object.fromEntries(seed.integrationErrors.map(item=>[item.id,item]));
  state.integrationErrors=(Array.isArray(state.integrationErrors)?state.integrationErrors:seed.integrationErrors).map((item,index)=>({id:item.id||`IERR-${String(index+1).padStart(3,'0')}`,integrationId:'EINT-1C',severity:'info',code:'INFO',title:'Integration event',detail:'',occurredAt:'',status:'review',...(errorSeedById[item.id]||{}),...item}));
  seed.integrationErrors.forEach(item=>{if(!state.integrationErrors.some(x=>x.id===item.id))state.integrationErrors.push(JSON.parse(JSON.stringify(item)));});
  const reconciliationSeedById=Object.fromEntries(seed.integrationReconciliation.map(item=>[item.id,item]));
  state.integrationReconciliation=(Array.isArray(state.integrationReconciliation)?state.integrationReconciliation:seed.integrationReconciliation).map((item,index)=>({id:item.id||`REC-${String(index+1).padStart(6,'0')}`,integrationId:'EINT-1C',period:'Not configured',platformSales:0,externalSales:0,difference:0,currency:'AMD',paymentsMatched:0,paymentsTotal:0,status:'review',...(reconciliationSeedById[item.id]||{}),...item}));
  seed.integrationReconciliation.forEach(item=>{if(!state.integrationReconciliation.some(x=>x.id===item.id))state.integrationReconciliation.push(JSON.parse(JSON.stringify(item)));});
  state.integrationPolicies={...seed.integrationPolicies,...(state.integrationPolicies||{})};
  const certificateSeedById=Object.fromEntries(seed.securityCertificates.map(item=>[item.id,item]));
  state.securityCertificates=(Array.isArray(state.securityCertificates)?state.securityCertificates:seed.securityCertificates).map((item,index)=>({id:item.id||`CERT-${String(index+1).padStart(3,'0')}`,name:'Certificate',type:'Platform certificate',environment:'Production',scope:'Platform',issuer:'Not configured',serial:'—',validFrom:'',expiresAt:'',owner:'Platform Security',autoRenew:false,status:'pending',fingerprint:'Managed in secure certificate store',notes:'',...(certificateSeedById[item.id]||{}),...item}));
  seed.securityCertificates.forEach(item=>{if(!state.securityCertificates.some(x=>x.id===item.id))state.securityCertificates.push(JSON.parse(JSON.stringify(item)));});
  const securityEventSeedById=Object.fromEntries(seed.securityEvents.map(item=>[item.id,item]));
  state.securityEvents=(Array.isArray(state.securityEvents)?state.securityEvents:seed.securityEvents).map((item,index)=>({id:item.id||`SEV-${String(index+1).padStart(4,'0')}`,time:'',severity:'info',category:'Security',title:'Security event',detail:'',actor:'System',status:'review',...(securityEventSeedById[item.id]||{}),...item}));
  seed.securityEvents.forEach(item=>{if(!state.securityEvents.some(x=>x.id===item.id))state.securityEvents.push(JSON.parse(JSON.stringify(item)));});
  const blockedSeedById=Object.fromEntries(seed.blockedEntities.map(item=>[item.id,item]));
  state.blockedEntities=(Array.isArray(state.blockedEntities)?state.blockedEntities:seed.blockedEntities).map((item,index)=>({id:item.id||`BLK-${String(index+1).padStart(3,'0')}`,type:'Identity',entity:'Unknown',scope:'Platform',reason:'Security review',blockedAt:'',actor:'Platform Security',status:'blocked',...(blockedSeedById[item.id]||{}),...item}));
  seed.blockedEntities.forEach(item=>{if(!state.blockedEntities.some(x=>x.id===item.id))state.blockedEntities.push(JSON.parse(JSON.stringify(item)));});
  state.securityPolicies={...seed.securityPolicies,...(state.securityPolicies||{})};
  const firmwareVersionSeedById=Object.fromEntries(seed.firmwareVersions.map(item=>[item.id,item]));
  state.firmwareVersions=(Array.isArray(state.firmwareVersions)?state.firmwareVersions:seed.firmwareVersions).map((item,index)=>({id:item.id||`FWV-${String(index+1).padStart(3,'0')}`,version:'0.0.0',channel:'Draft',releaseDate:'',status:'draft',signed:false,models:[],notes:'',...(firmwareVersionSeedById[item.id]||{}),...item,models:Array.isArray(item.models)?item.models:[]}));
  seed.firmwareVersions.forEach(item=>{if(!state.firmwareVersions.some(x=>x.id===item.id))state.firmwareVersions.push(JSON.parse(JSON.stringify(item)));});
  const modelSeedById=Object.fromEntries(seed.chargerModels.map(item=>[item.id,item]));
  state.chargerModels=(Array.isArray(state.chargerModels)?state.chargerModels:seed.chargerModels).map((item,index)=>({id:item.id||`MODEL-${String(index+1).padStart(3,'0')}`,manufacturer:'Unknown',model:'Charger',power:'—',chargers:0,currentVersion:'—',targetVersion:'—',compatibleVersions:[],coverage:0,status:'review',...(modelSeedById[item.id]||{}),...item,compatibleVersions:Array.isArray(item.compatibleVersions)?item.compatibleVersions:[]}));
  seed.chargerModels.forEach(item=>{if(!state.chargerModels.some(x=>x.id===item.id))state.chargerModels.push(JSON.parse(JSON.stringify(item)));});
  const campaignSeedById=Object.fromEntries(seed.firmwareCampaigns.map(item=>[item.id,item]));
  state.firmwareCampaigns=(Array.isArray(state.firmwareCampaigns)?state.firmwareCampaigns:seed.firmwareCampaigns).map((item,index)=>({id:item.id||`FW-${new Date().getFullYear()}.${String(index+1).padStart(2,'0')}`,name:'Firmware campaign',version:'—',scope:'Not configured',companyId:'CMP-001',models:[],modelIds:[],chargers:0,scheduledAt:'Not scheduled',window:'Not configured',strategy:'Staged',status:'draft',progress:0,success:0,failed:0,rolledBack:0,approval:'review',autoRollback:true,requiresIdle:true,notes:'',...(campaignSeedById[item.id]||{}),...item,models:Array.isArray(item.models)?item.models:[],modelIds:Array.isArray(item.modelIds)?item.modelIds:[]}));
  seed.firmwareCampaigns.forEach(item=>{if(!state.firmwareCampaigns.some(x=>x.id===item.id))state.firmwareCampaigns.push(JSON.parse(JSON.stringify(item)));});
  state.firmwareCampaigns.forEach(c=>{if(!c.modelIds?.length)c.modelIds=(c.models||[]).map(name=>state.chargerModels.find(m=>`${m.manufacturer} ${m.model}`===name)?.id).filter(Boolean);});
  const firmwareEventSeedById=Object.fromEntries(seed.firmwareEvents.map(item=>[item.id,item]));
  state.firmwareEvents=(Array.isArray(state.firmwareEvents)?state.firmwareEvents:seed.firmwareEvents).map((item,index)=>({id:item.id||`FWE-${String(index+1).padStart(3,'0')}`,campaignId:'',chargerId:'',charger:'Unknown charger',model:'Unknown model',fromVersion:'—',toVersion:'—',status:'review',time:'',detail:'',...(firmwareEventSeedById[item.id]||{}),...item}));
  seed.firmwareEvents.forEach(item=>{if(!state.firmwareEvents.some(x=>x.id===item.id))state.firmwareEvents.push(JSON.parse(JSON.stringify(item)));});
  state.firmwareEvents.forEach(e=>{e.chargerId=e.chargerId||((state.chargers||[]).some(c=>c.id===e.charger)?e.charger:'');});
  state.firmwarePolicies={...seed.firmwarePolicies,...(state.firmwarePolicies||{})};
  state.firmware.activeCampaigns=state.firmwareCampaigns.filter(x=>['running','scheduled'].includes(x.status)).length;
  state.firmware.scheduledChargers=state.firmwareCampaigns.filter(x=>x.status==='scheduled').reduce((sum,x)=>sum+Number(x.chargers||0),0);
  state.firmware.currentCoverage=Math.round(state.chargerModels.reduce((sum,x)=>sum+Number(x.coverage||0)*Number(x.chargers||0),0)/Math.max(1,state.chargerModels.reduce((sum,x)=>sum+Number(x.chargers||0),0)));
  state.firmware.failedUpdates=state.firmwareEvents.filter(x=>['failed','rollback'].includes(x.status)).length;
  const aiModelSeedById=Object.fromEntries(seed.aiModels.map(item=>[item.id,item]));
  state.aiModels=(Array.isArray(state.aiModels)?state.aiModels:seed.aiModels).map((item,index)=>({id:item.id||`AI-${String(index+1).padStart(3,'0')}`,name:'AI configuration',capability:'Forecasting',version:'0.1',scope:'Not configured',owner:'Platform',status:'draft',mode:'Advisory',confidence:0,metricLabel:'Validation',metricValue:'Not evaluated',lastEvaluated:'Never',lastRun:'Never',dataWindow:'Not configured',outputs:'Not configured',notes:'',...(aiModelSeedById[item.id]||{}),...item}));
  seed.aiModels.forEach(item=>{if(!state.aiModels.some(x=>x.id===item.id))state.aiModels.push(JSON.parse(JSON.stringify(item)));});
  const aiForecastSeedById=Object.fromEntries(seed.aiForecasts.map(item=>[item.id,item]));
  state.aiForecasts=(Array.isArray(state.aiForecasts)?state.aiForecasts:seed.aiForecasts).map((item,index)=>({id:item.id||`AIF-${String(index+1).padStart(3,'0')}`,modelId:'',title:'Forecast',horizon:'',value:'—',delta:'',confidence:0,severity:'info',detail:'',...(aiForecastSeedById[item.id]||{}),...item}));
  seed.aiForecasts.forEach(item=>{if(!state.aiForecasts.some(x=>x.id===item.id))state.aiForecasts.push(JSON.parse(JSON.stringify(item)));});
  const automationSeedById=Object.fromEntries(seed.automationRules.map(item=>[item.id,item]));
  state.automationRules=(Array.isArray(state.automationRules)?state.automationRules:seed.automationRules).map((item,index)=>({id:item.id||`AUT-${String(index+1).padStart(3,'0')}`,name:'Automation rule',category:'Operations',trigger:'Not configured',action:'Not configured',scope:'Platform',approval:'Approval required',status:'draft',lastTriggered:'Never',runs30d:0,guardrail:'No autonomous high-impact action',modelId:'',...(automationSeedById[item.id]||{}),...item}));
  seed.automationRules.forEach(item=>{if(!state.automationRules.some(x=>x.id===item.id))state.automationRules.push(JSON.parse(JSON.stringify(item)));});
  const aiApprovalSeedById=Object.fromEntries(seed.aiApprovals.map(item=>[item.id,item]));
  state.aiApprovals=(Array.isArray(state.aiApprovals)?state.aiApprovals:seed.aiApprovals).map((item,index)=>({id:item.id||`AIA-${String(index+1).padStart(3,'0')}`,type:'Recommendation',title:'Review AI recommendation',modelId:'',confidence:0,requestedAt:'',owner:'Platform',status:'review',detail:'',...(aiApprovalSeedById[item.id]||{}),...item}));
  seed.aiApprovals.forEach(item=>{if(!state.aiApprovals.some(x=>x.id===item.id))state.aiApprovals.push(JSON.parse(JSON.stringify(item)));});
  state.aiPolicies={...seed.aiPolicies,...(state.aiPolicies||{})};
  state.ai={...seed.ai,...(state.ai||{})};
  state.ai.activeModels=state.aiModels.filter(x=>x.status==='active').length;
  state.ai.automationRules=state.automationRules.filter(x=>x.status==='active').length;
  state.ai.openApprovals=state.aiApprovals.filter(x=>x.status==='review').length;
  const activeConfidence=state.aiModels.filter(x=>x.status==='active').map(x=>Number(x.confidence)||0);
  state.ai.forecastHealth=activeConfidence.length?Math.round(activeConfidence.reduce((a,b)=>a+b,0)/activeConfidence.length):0;
  const aiHealth=(state.integrations||[]).find(x=>x.id==='INT-AI');
  if(aiHealth){aiHealth.status=state.ai.openApprovals?'warning':'connected';aiHealth.detail=`${state.ai.activeModels} active models · ${state.ai.openApprovals} approval${state.ai.openApprovals===1?'':'s'} waiting`;aiHealth.latency=`${state.ai.forecastHealth}% forecast health`;}

  const energySiteSeedById=Object.fromEntries(seed.energySites.map(item=>[item.id,item]));
  state.energySites=(Array.isArray(state.energySites)?state.energySites:seed.energySites).map((item,index)=>({id:item.id||`ENG-SITE-${String(index+1).padStart(3,'0')}`,locationId:'',site:'Charging site',companyId:'CMP-001',countryCode:'AM',capacityKw:0,buildingReserveKw:0,safetyHeadroomKw:0,evBudgetKw:0,strategy:'Balanced fairness',peakLimitKw:0,solar:false,solarPeakKw:0,siteBattery:false,batteryCapacityKwh:0,batteryMaxDischargeKw:0,demandResponse:false,dynamicCost:false,status:'setup',override:'Market default',lastUpdated:'Never',...(energySiteSeedById[item.id]||{}),...item}));
  seed.energySites.forEach(item=>{if(!state.energySites.some(x=>x.id===item.id))state.energySites.push(JSON.parse(JSON.stringify(item)));});
  const energyLocationRefs={'ENG-SITE-001':'LOC-AM-YER-MALL','ENG-SITE-002':'LOC-AM-YER-REPUBLIC','ENG-SITE-003':'LOC-AM-YER-DALMA','ENG-SITE-004':'LOC-AM-ARARAT-DEPOT','ENG-SITE-005':'LOC-AM-SEVAN','ENG-SITE-006':'LOC-GE-TBILISI'};
  state.energySites.forEach(x=>{x.locationId=x.locationId||energyLocationRefs[x.id]||'';const loc=state.locations.find(l=>l.id===x.locationId);if(loc){x.site=loc.name;x.companyId=loc.companyId;x.countryCode=loc.countryCode;}});
  const energyRuleSeedById=Object.fromEntries(seed.energyPriorityRules.map(item=>[item.id,item]));
  state.energyPriorityRules=(Array.isArray(state.energyPriorityRules)?state.energyPriorityRules:seed.energyPriorityRules).map((item,index)=>({id:item.id||`EPR-${String(index+1).padStart(3,'0')}`,name:'Priority rule',signal:'Not configured',weight:0,appliesTo:'All managed vehicles',status:'draft',detail:'',...(energyRuleSeedById[item.id]||{}),...item}));
  seed.energyPriorityRules.forEach(item=>{if(!state.energyPriorityRules.some(x=>x.id===item.id))state.energyPriorityRules.push(JSON.parse(JSON.stringify(item)));});
  const drSeedById=Object.fromEntries(seed.demandResponsePrograms.map(item=>[item.id,item]));
  state.demandResponsePrograms=(Array.isArray(state.demandResponsePrograms)?state.demandResponsePrograms:seed.demandResponsePrograms).map((item,index)=>({id:item.id||`DR-${String(index+1).padStart(3,'0')}`,name:'Demand response program',scope:'Not configured',trigger:'Utility request',response:'Not configured',maxReductionPercent:0,minimumNoticeMinutes:0,status:'setup',lastEvent:'Never',...(drSeedById[item.id]||{}),...item}));
  seed.demandResponsePrograms.forEach(item=>{if(!state.demandResponsePrograms.some(x=>x.id===item.id))state.demandResponsePrograms.push(JSON.parse(JSON.stringify(item)));});
  state.energyPolicies={...seed.energyPolicies,...(state.energyPolicies||{})};
  state.energy={...seed.energy,...(state.energy||{})};
  const reportSeedById=Object.fromEntries(seed.reportDefinitions.map(item=>[item.id,item]));
  function normalizeReportScopeMetadata(item={}){
    const seeded=reportSeedById[item.id]||{};
    const source={...seeded,...item};
    const explicitLevel=String(source.scopeLevel||'').toLowerCase();
    let scopeLevel=['platform','company'].includes(explicitLevel)?explicitLevel:'';
    let companyIds=[...new Set((Array.isArray(source.companyIds)?source.companyIds:(source.companyId?[source.companyId]:[])).map(String).filter(Boolean))];
    const scopeText=String(source.scope||'').toLowerCase();
    if(!companyIds.length){
      companyIds=(state.companies||[]).filter(c=>scopeText.includes(String(c.name||'').toLowerCase())||scopeText.includes(String(c.primaryBrand||'').toLowerCase())).map(c=>c.id);
    }
    if(!scopeLevel)scopeLevel=/platform|all companies/.test(scopeText)?'platform':'company';
    if(scopeLevel==='platform')companyIds=[];
    return {scopeLevel,companyIds};
  }
  state.reportDefinitions=(Array.isArray(state.reportDefinitions)?state.reportDefinitions:seed.reportDefinitions).map((item,index)=>{
    const scopeMeta=normalizeReportScopeMetadata(item);
    return {id:item.id||`RPT-${String(index+1).padStart(3,'0')}`,name:'Administrative report',category:'Governance',scope:'Platform',scopeLevel:scopeMeta.scopeLevel,companyIds:scopeMeta.companyIds,owner:'Platform Administration',schedule:'Manual',format:'CSV',status:'draft',lastRun:'Never',nextRun:'Not scheduled',dataDomains:[],description:'',...(reportSeedById[item.id]||{}),...item,scopeLevel:scopeMeta.scopeLevel,companyIds:scopeMeta.companyIds,dataDomains:Array.isArray(item.dataDomains)?item.dataDomains:[]};
  });
  seed.reportDefinitions.forEach(item=>{if(!state.reportDefinitions.some(x=>x.id===item.id))state.reportDefinitions.push(JSON.parse(JSON.stringify(item)));});
  const reportRunSeedById=Object.fromEntries(seed.reportRuns.map(item=>[item.id,item]));
  state.reportRuns=(Array.isArray(state.reportRuns)?state.reportRuns:seed.reportRuns).map((item,index)=>{
    const report=state.reportDefinitions.find(r=>r.id===(item.reportId||reportRunSeedById[item.id]?.reportId));
    const source={...(reportRunSeedById[item.id]||{}),...item};
    const scopeLevel=['platform','company'].includes(String(source.scopeLevel||'').toLowerCase())?String(source.scopeLevel).toLowerCase():(report?.scopeLevel||'platform');
    const companyIds=scopeLevel==='platform'?[]:[...new Set((Array.isArray(source.companyIds)&&source.companyIds.length?source.companyIds:(report?.companyIds||[])).map(String).filter(Boolean))];
    return {id:item.id||`RUN-${String(index+1).padStart(4,'0')}`,reportId:'RPT-001',runAt:'Never',period:'Manual run',format:'CSV',rows:0,status:'ready',generatedBy:'Administrator',summary:'',...source,scopeLevel,companyIds};
  });
  seed.reportRuns.forEach(item=>{if(!state.reportRuns.some(x=>x.id===item.id)){const report=state.reportDefinitions.find(r=>r.id===item.reportId);state.reportRuns.push({...JSON.parse(JSON.stringify(item)),scopeLevel:report?.scopeLevel||'platform',companyIds:[...(report?.companyIds||[])]});}});
  state.reportingPolicies={...seed.reportingPolicies,...(state.reportingPolicies||{})};
  state.platformSettings={
    general:{...seed.platformSettings.general,...(state.platformSettings?.general||{})},
    charging:{...seed.platformSettings.charging,...(state.platformSettings?.charging||{})},
    communications:{...seed.platformSettings.communications,...(state.platformSettings?.communications||{})},
    numbering:{...seed.platformSettings.numbering,...(state.platformSettings?.numbering||{})},
    retention:{...seed.platformSettings.retention,...(state.platformSettings?.retention||{})},
    features:{...seed.platformSettings.features,...(state.platformSettings?.features||{})},
    support:{...seed.platformSettings.support,...(state.platformSettings?.support||{})}
  };
  state.platformSettings.retention.auditDays=Number(state.reportingPolicies.auditRetentionDays||state.securityPolicies?.auditRetentionDays||state.platformSettings.retention.auditDays||365);
  function inferAuditModule(item){
    const text=`${item.title||''} ${item.detail||''}`.toLowerCase();
    if(text.includes('role')||text.includes('user')||text.includes('access')||item.icon==='♙') return 'Users & Access';
    if(text.includes('erp')||text.includes('mapping')||text.includes('integration')||item.icon==='⇄') return 'ERP & Integrations';
    if(text.includes('tariff')) return 'Tariffs & Pricing';
    if(text.includes('accounting')||text.includes('journal')||text.includes('ledger')||text.includes('profitability')||item.icon==='⌁') return 'Accounting';
    if(text.includes('payment')||text.includes('refund')||text.includes('transaction')||text.includes('subscription')||text.includes('charging package')||item.icon==='▤') return 'Payments';
    if(text.includes('settlement')||text.includes('partner')) return 'Partners & Settlements';
    if(text.includes('roaming')) return 'Roaming';
    if(text.includes('certificate')||text.includes('rfid')||text.includes('security')||item.icon==='◇') return 'Security & Certificates';
    if(text.includes('firmware')||item.icon==='↻') return 'Firmware';
    if(text.includes('energy')||text.includes('load optimization')||item.icon==='⚡') return 'Energy & Load Optimization';
    if(text.includes('ai')||text.includes('automation')||text.includes('anomaly')||item.icon==='✦'||item.icon==='AUT') return 'AI & Automation';
    if(text.includes('platform setting')||text.includes('feature flag')||text.includes('global default')||item.icon==='⚙') return 'Platform Settings';
    if(text.includes('tax')) return 'Taxes';
    if(text.includes('company')||item.icon==='▣') return 'Companies';
    if(text.includes('country')||text.includes('currency')) return 'Countries & Currencies';
    return 'Platform Administration';
  }
  function inferAuditSeverity(item){
    const text=`${item.title||''} ${item.detail||''}`.toLowerCase();
    if(text.includes('compromised')||text.includes('critical')||text.includes('revoked')||text.includes('emergency')) return 'critical';
    if(text.includes('blocked')||text.includes('warning')||text.includes('review')||text.includes('approval')||text.includes('timeout')||text.includes('failed')||text.includes('expire')) return 'warning';
    return 'info';
  }
  function platformTimeZone(){return state.platformSettings?.general?.timezone||'Asia/Yerevan';}
  function dateParts(date=new Date()){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:platformTimeZone(),year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
    return Object.fromEntries(parts.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  }
  function today(date=new Date()){const p=dateParts(date);return `${p.year}-${p.month}-${p.day}`;}
  function timeNow(date=new Date()){const p=dateParts(date);return `${p.hour}:${p.minute}`;}
  function now(date=new Date()){return `${today(date)} ${timeNow(date)}`;}
  function addDays(days,date=new Date()){const d=new Date(date.getTime()+Number(days||0)*86400000);return today(d);}
  function addYears(years,date=new Date()){const d=new Date(date);d.setUTCFullYear(d.getUTCFullYear()+Number(years||0));return today(d);}
  function currentUser(){return state.userDirectory?.find(u=>u.id===state.currentSession?.userId)||state.userDirectory?.find(u=>u.name===state.admin?.name)||null;}
  function currentRole(){const user=currentUser();return state.roles?.find(r=>r.id===user?.roleId)||null;}
  function can(permission){const role=currentRole();return Boolean(role&&(role.permissions?.includes('*')||role.permissions?.includes(permission)));}
  function uniqueScopeValues(value){return [...new Set((Array.isArray(value)?value:[]).map(x=>String(x||'').trim()).filter(Boolean))];}
  function normalizeAccessScope(scope,user=currentUser()){
    const seedUser=seed.userDirectory?.find(x=>x.id===user?.id);
    const source=scope||user?.accessScope||seedUser?.accessScope||null;
    const fallbackCompany=user?.companyId?[user.companyId]:[];
    const fallbackCountry=fallbackCompany.map(id=>state.companies?.find(c=>c.id===id)?.countryCode).filter(Boolean);
    if(source&&typeof source==='object'){
      const level=['platform','company','country','site','charger'].includes(String(source.level||'').toLowerCase())?String(source.level).toLowerCase():'company';
      return {level,companyIds:uniqueScopeValues(source.companyIds?.length?source.companyIds:fallbackCompany),countryCodes:uniqueScopeValues(source.countryCodes?.length?source.countryCodes:fallbackCountry),siteIds:uniqueScopeValues(source.siteIds),chargerIds:uniqueScopeValues(source.chargerIds)};
    }
    const legacy=String(user?.scope||'').toLowerCase();
    if(legacy.includes('platform')||currentRole()?.id==='ROLE-PLATFORM-ADMIN') return {level:'platform',companyIds:[],countryCodes:[],siteIds:[],chargerIds:[]};
    return {level:'company',companyIds:fallbackCompany,countryCodes:uniqueScopeValues(fallbackCountry),siteIds:[],chargerIds:[]};
  }
  function currentAccessScope(){return normalizeAccessScope(currentUser()?.accessScope,currentUser());}
  function isPlatformScope(){return currentAccessScope().level==='platform';}
  function scopeAllows(target={}){
    const user=currentUser(),role=currentRole();if(!user||!role)return false;
    const scope=currentAccessScope();if(scope.level==='platform')return true;
    const charger=target.chargerId?state.chargers?.find(x=>x.id===target.chargerId):null;
    const siteId=target.siteId||charger?.locationId||'';
    const site=siteId?state.locations?.find(x=>x.id===siteId):null;
    const companyId=target.companyId||charger?.companyId||site?.companyId||'';
    const countryCode=target.countryCode||site?.countryCode||(companyId?state.companies?.find(c=>c.id===companyId)?.countryCode:'')||'';
    if(companyId&&scope.companyIds.length&&!scope.companyIds.includes(companyId))return false;
    if(countryCode&&scope.countryCodes.length&&!scope.countryCodes.includes(countryCode))return false;
    if(siteId&&scope.siteIds.length&&!scope.siteIds.includes(siteId))return false;
    if(target.chargerId&&scope.chargerIds.length&&!scope.chargerIds.includes(target.chargerId))return false;
    if(countryCode&&!companyId&&scope.companyIds.length){
      const allowedCountries=uniqueScopeValues(scope.companyIds.map(id=>state.companies?.find(c=>c.id===id)?.countryCode));
      if(allowedCountries.length&&!allowedCountries.includes(countryCode))return false;
    }
    return true;
  }
  function companyInScope(companyId){return scopeAllows({companyId});}
  function countryInScope(countryCode){return scopeAllows({countryCode});}
  function siteInScope(siteId){const site=state.locations?.find(x=>x.id===siteId);return Boolean(site)&&scopeAllows({siteId,companyId:site.companyId,countryCode:site.countryCode});}
  function chargerInScope(chargerId,context={}){const charger=state.chargers?.find(x=>x.id===chargerId);return Boolean(charger)&&scopeAllows({...context,chargerId,siteId:context.siteId||charger.locationId,companyId:context.companyId||charger.companyId});}
  function reportInScope(item){
    if(!item)return false;
    if(isPlatformScope())return true;
    if(String(item.scopeLevel||'platform').toLowerCase()==='platform')return false;
    const ids=Array.isArray(item.companyIds)?item.companyIds:(item.companyId?[item.companyId]:[]);
    return ids.length>0&&ids.some(id=>companyInScope(id));
  }
  function auditInScope(item){
    if(!item)return false;
    if(isPlatformScope())return true;
    if(item.companyId)return companyInScope(item.companyId);
    const actor=state.userDirectory?.find(u=>u.name===item.actor);
    return Boolean(actor?.companyId&&companyInScope(actor.companyId)&&currentAccessScope().level!=='site'&&currentAccessScope().level!=='charger');
  }
  function canGrantScope(candidate,companyId){
    if(!companyInScope(companyId))return false;
    const target=normalizeAccessScope(candidate,{companyId,accessScope:candidate});
    if(target.level==='platform')return isPlatformScope()&&can('roles.manage');
    if(target.companyIds.length&&!target.companyIds.includes(companyId))return false;
    for(const siteId of target.siteIds){
      const site=state.locations?.find(x=>x.id===siteId);
      if(!site||site.companyId!==companyId)return false;
      if(target.countryCodes.length&&!target.countryCodes.includes(site.countryCode))return false;
    }
    const actor=currentAccessScope();
    if(actor.level==='platform')return true;
    if(target.companyIds.some(id=>!scopeAllows({companyId:id})))return false;
    if(target.countryCodes.some(code=>!scopeAllows({countryCode:code})))return false;
    if(target.siteIds.some(id=>!siteInScope(id)))return false;
    if(actor.chargerIds.length&&target.chargerIds.some(id=>!actor.chargerIds.includes(id)))return false;
    return true;
  }
  function canAssignRole(roleId,companyId){
    if(!can('users.manage')||!companyInScope(companyId))return false;
    const targetRole=state.roles?.find(r=>r.id===roleId);if(!targetRole)return false;
    if(can('roles.manage')){if(isPlatformScope())return true;return !targetRole.permissions?.includes('*')&&targetRole.scopeModel!=='Platform';}
    if(targetRole.privileged||targetRole.permissions?.includes('*')||targetRole.permissions?.includes('roles.manage')||targetRole.scopeModel==='Platform')return false;
    return true;
  }
  function canManageUser(user){
    if(!user||!can('users.manage')||!companyInScope(user.companyId))return false;
    const targetRole=state.roles?.find(r=>r.id===user.roleId);
    if(!can('roles.manage')&&(user.id===currentUser()?.id||targetRole?.privileged||targetRole?.permissions?.includes('*')))return false;
    return true;
  }
  function canAccessAdminModule(permission,options={}){
    if(!can('admin.portal.view'))return false;
    if(permission&&permission!=='admin.portal.view'&&!can(permission))return false;
    if(options.platformOnly&&!isPlatformScope())return false;
    return true;
  }
  function requirePermission(permission,message='You do not have permission to perform this action.'){if(can(permission))return true;queueMicrotask(()=>window.AdminUI?.toast?.(message));return false;}
  function companyContextId(search){
    let raw=search;
    if(raw===undefined){try{raw=window.location?.search||'';}catch(_){raw='';}}
    let id='';
    try{id=String(new URLSearchParams(raw||'').get('companyId')||'').trim();}catch(_){id='';}
    if(!id)return '';
    const company=(state.companies||[]).find(c=>c.id===id);
    return company&&companyInScope(id)?id:'';
  }
  function companyContext(search){const id=companyContextId(search);return id?(state.companies||[]).find(c=>c.id===id)||null:null;}
  function countryContextCode(search){
    if(companyContextId(search))return '';
    let raw=search;if(raw===undefined){try{raw=window.location?.search||'';}catch(_){raw='';}}
    let code='';try{code=String(new URLSearchParams(raw||'').get('countryCode')||'').trim().toUpperCase();}catch(_){code='';}
    return code&&state.countries?.some(c=>c.code===code)&&countryInScope(code)?code:'';
  }
  function countryContext(search){const code=countryContextCode(search);return code?(state.countries||[]).find(c=>c.code===code)||null:null;}
  function companyContextMatch(companyId,search){const id=companyContextId(search);return !id||String(companyId||'')===id;}
  function countryContextMatch(countryCode,search){const company=companyContext(search);if(company)return String(countryCode||'')===String(company.countryCode||'');const code=countryContextCode(search);return !code||String(countryCode||'').toUpperCase()===code;}
  function itemMatchesCompanyContext(item={},search){
    const id=companyContextId(search);if(!id)return true;
    if(item.companyId!==undefined&&item.companyId!==null&&String(item.companyId)!=='')return String(item.companyId)===id;
    if(Array.isArray(item.companyIds))return item.companyIds.map(String).includes(id);
    return false;
  }
  function contextUrl(page,companyId=companyContextId()){
    const target=String(page||'').split('?')[0],id=String(companyId||'').trim();
    return id&&state.companies?.some(c=>c.id===id)&&companyInScope(id)?`${target}?companyId=${encodeURIComponent(id)}`:target;
  }
  function countryContextUrl(page,countryCode=countryContextCode()){const target=String(page||'').split('?')[0],code=String(countryCode||'').trim().toUpperCase();return code&&state.countries?.some(c=>c.code===code)&&countryInScope(code)?`${target}?countryCode=${encodeURIComponent(code)}`:target;}
  function repairDataIntegrity(){
    const companyById=id=>(state.companies||[]).find(x=>x.id===id),currencyExists=code=>(state.currencies||[]).some(x=>x.code===code),locationById=id=>(state.locations||[]).find(x=>x.id===id),chargerById=id=>(state.chargers||[]).find(x=>x.id===id);
    (state.locations||[]).forEach(loc=>{const c=companyById(loc.companyId);if(c)loc.countryCode=c.countryCode;});
    (state.chargers||[]).forEach(ch=>{const loc=locationById(ch.locationId);if(loc)ch.companyId=loc.companyId;});
    (state.userDirectory||[]).forEach(u=>{const c=companyById(u.companyId);if(!c)return;u.accessScope=normalizeAccessScope(u.accessScope,u);u.accessScope.companyIds=u.accessScope.level==='platform'?[]:[c.id];u.accessScope.countryCodes=u.accessScope.level==='platform'?[]:[c.countryCode];u.accessScope.siteIds=(u.accessScope.siteIds||[]).map(id=>legacySiteIdMap[id]||id).filter(id=>locationById(id)?.companyId===c.id);u.accessScope.chargerIds=(u.accessScope.chargerIds||[]).filter(id=>chargerById(id)?.companyId===c.id);});
    (state.tariffProfiles||[]).forEach(t=>{const c=companyById(t.companyId);if(c){t.countryCode=c.countryCode;t.currency=c.currency;}const tax=(state.taxProfiles||[]).find(x=>x.id===t.taxProfileId&&x.countryCode===t.countryCode);if(!tax){const fallback=(state.taxProfiles||[]).find(x=>x.countryCode===t.countryCode&&x.defaultForMarket)||(state.taxProfiles||[]).find(x=>x.countryCode===t.countryCode);if(fallback)t.taxProfileId=fallback.id;}t.scopeRefs=t.scopeRefs||{locationIds:[],chargerIds:[],modelIds:[]};if(!(t.scopeRefs.locationIds?.length||t.scopeRefs.chargerIds?.length||t.scopeRefs.modelIds?.length)&&tariffScopeRefsById[t.id])t.scopeRefs=JSON.parse(JSON.stringify(tariffScopeRefsById[t.id]));t.scopeRefs.locationIds=[...new Set((t.scopeRefs.locationIds||[]).filter(id=>locationById(id)?.companyId===t.companyId))];t.scopeRefs.chargerIds=[...new Set((t.scopeRefs.chargerIds||[]).filter(id=>chargerById(id)?.companyId===t.companyId))];t.scopeRefs.modelIds=[...new Set((t.scopeRefs.modelIds||[]).filter(id=>(state.chargerModels||[]).some(m=>m.id===id)))];});
    (state.paymentProviders||[]).forEach(p=>{const c=companyById(p.companyId);if(c)p.countryCode=c.countryCode;p.currencies=[...new Set((p.currencies||[]).filter(currencyExists))];if(!currencyExists(p.settlementCurrency))p.settlementCurrency=c?.currency||state.platformSettings?.general?.defaultCurrency||'AMD';});
    (state.paymentTransactions||[]).forEach(t=>{if(t.providerId){const p=(state.paymentProviders||[]).find(x=>x.id===t.providerId);if(p)t.companyId=p.companyId;}const c=companyById(t.companyId);if(c&&!currencyExists(t.currency))t.currency=c.currency;});
    (state.subscriptionPlans||[]).forEach(p=>{const c=companyById(p.companyId);if(c){p.countryCode=c.countryCode;p.currency=c.currency;}p.siteIds=[...new Set((p.siteIds||[]).filter(id=>locationById(id)?.companyId===p.companyId))];});
    (state.partners||[]).forEach(p=>{const c=companyById(p.companyId);if(c){p.countryCode=c.countryCode;p.currency=c.currency;}if(!(p.siteIds||[]).length&&partnerSiteRefsById[p.id])p.siteIds=[...partnerSiteRefsById[p.id]];p.siteIds=[...new Set((p.siteIds||[]).filter(id=>locationById(id)?.companyId===p.companyId))];p.linkedSites=p.siteIds.length;});
    (state.settlementRuns||[]).forEach(r=>{const p=(state.partners||[]).find(x=>x.id===r.partnerId);if(p){r.companyId=p.companyId;r.currency=p.currency;}});
    (state.enterpriseIntegrations||[]).forEach(i=>{const c=companyById(i.companyId);if(c)i.countryCode=c.countryCode;if(!['Multi-currency','N/A'].includes(i.currency)&&!currencyExists(i.currency))i.currency=c?.currency||'AMD';});
    (state.energySites||[]).forEach(e=>{e.locationId=e.locationId||energyLocationRefs[e.id]||'';const loc=locationById(e.locationId);if(loc){e.site=loc.name;e.companyId=loc.companyId;e.countryCode=loc.countryCode;}});
    (state.accountingEntries||[]).forEach(e=>{if(!e.siteId&&accountingLocationRefsById[e.id])Object.assign(e,accountingLocationRefsById[e.id]);if(e.id==='JRN-000377'&&e.sourceId==='SET-2407-01')e.sourceId='SET-2608-001';const ch=chargerById(e.chargerId);if(ch&&!e.siteId)e.siteId=ch.locationId;const loc=locationById(e.siteId);if(loc){e.companyId=loc.companyId;e.site=loc.name;}if(ch){e.companyId=ch.companyId;e.charger=ch.id;}else if(!e.chargerId)e.charger='—';const c=companyById(e.companyId);if(c&&!currencyExists(e.currency))e.currency=c.currency;});
    (state.profitabilityRecords||[]).forEach(r=>{r.entityId=r.entityId||profitabilityRefsById[r.id]||'';if(r.scopeType==='Site'){const loc=locationById(r.entityId);if(loc){r.companyId=loc.companyId;r.entity=loc.name;}}else if(r.scopeType==='Charger'){const ch=chargerById(r.entityId);if(ch){r.companyId=ch.companyId;r.entity=ch.id;}}const c=companyById(r.companyId);if(c&&!currencyExists(r.currency))r.currency=c.currency;});
    (state.firmwareCampaigns||[]).forEach(c=>{if(!(c.modelIds||[]).length)c.modelIds=(c.models||[]).map(name=>(state.chargerModels||[]).find(m=>m.model===name||`${m.manufacturer} ${m.model}`===name)?.id).filter(Boolean);c.modelIds=[...new Set((c.modelIds||[]).filter(id=>(state.chargerModels||[]).some(m=>m.id===id)))];});
    (state.firmwareEvents||[]).forEach(e=>{const ch=chargerById(e.chargerId||e.charger);if(ch){e.chargerId=ch.id;e.charger=ch.id;}});
    return state;
  }
  function validateDataIntegrity(){
    const issues=[],push=(severity,code,entityType,entityId,detail)=>issues.push({severity,code,entityType,entityId,detail});
    const company=id=>(state.companies||[]).find(x=>x.id===id),country=code=>(state.countries||[]).find(x=>x.code===code),currency=code=>(state.currencies||[]).find(x=>x.code===code),location=id=>(state.locations||[]).find(x=>x.id===id),charger=id=>(state.chargers||[]).find(x=>x.id===id);
    (state.countries||[]).forEach(c=>{if(!currency(c.currency))push('critical','COUNTRY_CURRENCY_MISSING','Country',c.code,`Unknown default currency ${c.currency}`);});
    (state.companies||[]).forEach(c=>{if(!country(c.countryCode))push('critical','COMPANY_COUNTRY_MISSING','Company',c.id,`Unknown country ${c.countryCode}`);if(!currency(c.currency))push('critical','COMPANY_CURRENCY_MISSING','Company',c.id,`Unknown currency ${c.currency}`);});
    (state.locations||[]).forEach(x=>{const c=company(x.companyId);if(!c)push('critical','LOCATION_COMPANY_MISSING','Location',x.id,`Unknown company ${x.companyId}`);else if(x.countryCode!==c.countryCode)push('warning','LOCATION_COUNTRY_MISMATCH','Location',x.id,`${x.countryCode} differs from ${c.countryCode}`);});
    (state.chargers||[]).forEach(x=>{const loc=location(x.locationId);if(!loc)push('critical','CHARGER_LOCATION_MISSING','Charger',x.id,`Unknown location ${x.locationId}`);else if(x.companyId!==loc.companyId)push('critical','CHARGER_COMPANY_MISMATCH','Charger',x.id,`${x.companyId} differs from location company ${loc.companyId}`);if(x.modelId&&!(state.chargerModels||[]).some(m=>m.id===x.modelId))push('warning','CHARGER_MODEL_MISSING','Charger',x.id,`Unknown model ${x.modelId}`);});
    (state.userDirectory||[]).forEach(u=>{const c=company(u.companyId);if(!c)push('critical','USER_COMPANY_MISSING','User',u.id,`Unknown company ${u.companyId}`);if(!(state.roles||[]).some(r=>r.id===u.roleId))push('critical','USER_ROLE_MISSING','User',u.id,`Unknown role ${u.roleId}`);for(const id of u.accessScope?.siteIds||[]){const loc=location(id);if(!loc)push('critical','USER_SCOPE_LOCATION_MISSING','User',u.id,`Unknown location ${id}`);else if(c&&loc.companyId!==c.id)push('critical','USER_SCOPE_LOCATION_COMPANY_MISMATCH','User',u.id,`Location ${id} belongs to ${loc.companyId}`);}for(const id of u.accessScope?.chargerIds||[]){const ch=charger(id);if(!ch)push('critical','USER_SCOPE_CHARGER_MISSING','User',u.id,`Unknown charger ${id}`);else if(c&&ch.companyId!==c.id)push('critical','USER_SCOPE_CHARGER_COMPANY_MISMATCH','User',u.id,`Charger ${id} belongs to ${ch.companyId}`);}});
    (state.tariffProfiles||[]).forEach(t=>{const c=company(t.companyId);if(!c)push('critical','TARIFF_COMPANY_MISSING','Tariff',t.id,`Unknown company ${t.companyId}`);if(c&&t.countryCode!==c.countryCode)push('critical','TARIFF_COUNTRY_MISMATCH','Tariff',t.id,`${t.countryCode} differs from company ${c.countryCode}`);if(c&&t.currency!==c.currency)push('warning','TARIFF_CURRENCY_MISMATCH','Tariff',t.id,`${t.currency} differs from company ${c.currency}`);const tax=(state.taxProfiles||[]).find(x=>x.id===t.taxProfileId);if(!tax)push('critical','TARIFF_TAX_MISSING','Tariff',t.id,`Unknown tax profile ${t.taxProfileId}`);else if(tax.countryCode!==t.countryCode)push('critical','TARIFF_TAX_MARKET_MISMATCH','Tariff',t.id,`Tax ${tax.id} belongs to ${tax.countryCode}`);if(['Specific site','Site group'].includes(t.scopeType)&&!(t.scopeRefs?.locationIds||[]).length)push('warning','TARIFF_SCOPE_UNRESOLVED','Tariff',t.id,'Site-based scope has no location IDs');if(t.scopeType==='Charger group'&&!(t.scopeRefs?.chargerIds||[]).length&&!(t.scopeRefs?.modelIds||[]).length)push('warning','TARIFF_SCOPE_UNRESOLVED','Tariff',t.id,'Charger-group scope has no charger/model IDs');for(const id of t.scopeRefs?.locationIds||[]){const loc=location(id);if(!loc||loc.companyId!==t.companyId)push('critical','TARIFF_LOCATION_MISMATCH','Tariff',t.id,`Location ${id} is invalid for ${t.companyId}`);}for(const id of t.scopeRefs?.chargerIds||[]){const ch=charger(id);if(!ch||ch.companyId!==t.companyId)push('critical','TARIFF_CHARGER_MISMATCH','Tariff',t.id,`Charger ${id} is invalid for ${t.companyId}`);}for(const id of t.scopeRefs?.modelIds||[])if(!(state.chargerModels||[]).some(m=>m.id===id))push('critical','TARIFF_MODEL_MISSING','Tariff',t.id,`Unknown charger model ${id}`);});
    (state.paymentProviders||[]).forEach(p=>{const c=company(p.companyId);if(!c)push('critical','PROVIDER_COMPANY_MISSING','Payment Provider',p.id,`Unknown company ${p.companyId}`);else if(p.countryCode!==c.countryCode)push('critical','PROVIDER_COUNTRY_MISMATCH','Payment Provider',p.id,`${p.countryCode} differs from ${c.countryCode}`);for(const code of p.currencies||[])if(!currency(code))push('critical','PROVIDER_CURRENCY_MISSING','Payment Provider',p.id,`Unknown currency ${code}`);if(!currency(p.settlementCurrency))push('critical','PROVIDER_SETTLEMENT_CURRENCY_MISSING','Payment Provider',p.id,`Unknown settlement currency ${p.settlementCurrency}`);});
    (state.paymentTransactions||[]).forEach(t=>{if(!company(t.companyId))push('critical','TRANSACTION_COMPANY_MISSING','Payment Transaction',t.id,`Unknown company ${t.companyId}`);if(!currency(t.currency))push('critical','TRANSACTION_CURRENCY_MISSING','Payment Transaction',t.id,`Unknown currency ${t.currency}`);if(t.providerId){const p=(state.paymentProviders||[]).find(x=>x.id===t.providerId);if(!p)push('critical','TRANSACTION_PROVIDER_MISSING','Payment Transaction',t.id,`Unknown provider ${t.providerId}`);else if(p.companyId!==t.companyId)push('critical','TRANSACTION_PROVIDER_COMPANY_MISMATCH','Payment Transaction',t.id,`${p.companyId} differs from ${t.companyId}`);}});
    (state.subscriptionPlans||[]).forEach(p=>{const c=company(p.companyId);if(!c)push('critical','PLAN_COMPANY_MISSING','Subscription Plan',p.id,`Unknown company ${p.companyId}`);else{if(p.countryCode!==c.countryCode)push('critical','PLAN_COUNTRY_MISMATCH','Subscription Plan',p.id,`${p.countryCode} differs from ${c.countryCode}`);if(p.currency!==c.currency)push('warning','PLAN_CURRENCY_MISMATCH','Subscription Plan',p.id,`${p.currency} differs from ${c.currency}`);}for(const id of p.siteIds||[]){const loc=location(id);if(!loc||loc.companyId!==p.companyId)push('critical','PLAN_LOCATION_MISMATCH','Subscription Plan',p.id,`Location ${id} is invalid for ${p.companyId}`);}});
    (state.partners||[]).forEach(p=>{const c=company(p.companyId);if(!c)push('critical','PARTNER_COMPANY_MISSING','Partner',p.id,`Unknown company ${p.companyId}`);else{if(p.countryCode!==c.countryCode)push('critical','PARTNER_COUNTRY_MISMATCH','Partner',p.id,`${p.countryCode} differs from ${c.countryCode}`);if(p.currency!==c.currency)push('warning','PARTNER_CURRENCY_MISMATCH','Partner',p.id,`${p.currency} differs from ${c.currency}`);}for(const id of p.siteIds||[])if(location(id)?.companyId!==p.companyId)push('critical','PARTNER_LOCATION_MISMATCH','Partner',p.id,`Location ${id} is invalid for ${p.companyId}`);if(Number(p.linkedSites||0)!==(p.siteIds||[]).length)push('warning','PARTNER_LOCATION_COUNT_MISMATCH','Partner',p.id,`${p.linkedSites} differs from ${(p.siteIds||[]).length} canonical locations`);});
    (state.settlementRuns||[]).forEach(r=>{const p=(state.partners||[]).find(x=>x.id===r.partnerId);if(!p)push('critical','SETTLEMENT_PARTNER_MISSING','Settlement',r.id,`Unknown partner ${r.partnerId}`);else{if(r.companyId!==p.companyId)push('critical','SETTLEMENT_COMPANY_MISMATCH','Settlement',r.id,`${r.companyId} differs from ${p.companyId}`);if(r.currency!==p.currency)push('warning','SETTLEMENT_CURRENCY_MISMATCH','Settlement',r.id,`${r.currency} differs from ${p.currency}`);}});
    (state.enterpriseIntegrations||[]).forEach(i=>{const c=company(i.companyId);if(!c)push('critical','INTEGRATION_COMPANY_MISSING','Integration',i.id,`Unknown company ${i.companyId}`);else if(i.countryCode!==c.countryCode)push('critical','INTEGRATION_COUNTRY_MISMATCH','Integration',i.id,`${i.countryCode} differs from ${c.countryCode}`);if(!['Multi-currency','N/A'].includes(i.currency)&&!currency(i.currency))push('critical','INTEGRATION_CURRENCY_MISSING','Integration',i.id,`Unknown currency ${i.currency}`);});
    (state.energySites||[]).forEach(e=>{const loc=location(e.locationId);if(!loc)push('critical','ENERGY_LOCATION_MISSING','Energy Policy',e.id,`Unknown location ${e.locationId}`);else{if(e.companyId!==loc.companyId)push('critical','ENERGY_COMPANY_MISMATCH','Energy Policy',e.id,`${e.companyId} differs from ${loc.companyId}`);if(e.countryCode!==loc.countryCode)push('critical','ENERGY_COUNTRY_MISMATCH','Energy Policy',e.id,`${e.countryCode} differs from ${loc.countryCode}`);}});const energyLocationCounts=new Map();(state.energySites||[]).forEach(e=>{if(e.locationId)energyLocationCounts.set(e.locationId,(energyLocationCounts.get(e.locationId)||0)+1);});for(const [id,count] of energyLocationCounts)if(count>1)push('warning','ENERGY_LOCATION_DUPLICATE','Energy Policy',id,`${count} energy policies reference the same Location`);
    (state.accountingEntries||[]).forEach(e=>{const c=company(e.companyId),loc=e.siteId?location(e.siteId):null,ch=e.chargerId?charger(e.chargerId):null;if(!c)push('critical','ACCOUNTING_COMPANY_MISSING','Accounting Entry',e.id,`Unknown company ${e.companyId}`);if(e.siteId&&!loc)push('critical','ACCOUNTING_LOCATION_MISSING','Accounting Entry',e.id,`Unknown location ${e.siteId}`);else if(loc&&loc.companyId!==e.companyId)push('critical','ACCOUNTING_LOCATION_COMPANY_MISMATCH','Accounting Entry',e.id,`Location ${e.siteId} belongs to ${loc.companyId}`);if(e.chargerId&&!ch)push('critical','ACCOUNTING_CHARGER_MISSING','Accounting Entry',e.id,`Unknown charger ${e.chargerId}`);else if(ch&&(ch.companyId!==e.companyId||(e.siteId&&ch.locationId!==e.siteId)))push('critical','ACCOUNTING_CHARGER_ATTRIBUTION_MISMATCH','Accounting Entry',e.id,`Charger ${e.chargerId} does not match company/location attribution`);if(!currency(e.currency))push('critical','ACCOUNTING_CURRENCY_MISSING','Accounting Entry',e.id,`Unknown currency ${e.currency}`);if(e.sourceType==='Payment fee'&&e.sourceId&&!(state.paymentTransactions||[]).some(x=>x.id===e.sourceId))push('critical','ACCOUNTING_SOURCE_MISSING','Accounting Entry',e.id,`Unknown payment transaction ${e.sourceId}`);if(e.sourceType==='Partner settlement'&&e.sourceId&&!(state.settlementRuns||[]).some(x=>x.id===e.sourceId))push('critical','ACCOUNTING_SOURCE_MISSING','Accounting Entry',e.id,`Unknown settlement ${e.sourceId}`);});
    (state.profitabilityRecords||[]).forEach(r=>{const entity=r.scopeType==='Site'?location(r.entityId):charger(r.entityId);if(r.scopeType==='Site'&&!entity)push('critical','PROFITABILITY_LOCATION_MISSING','Profitability',r.id,`Unknown location ${r.entityId}`);if(r.scopeType==='Charger'&&!entity)push('critical','PROFITABILITY_CHARGER_MISSING','Profitability',r.id,`Unknown charger ${r.entityId}`);if(entity&&entity.companyId!==r.companyId)push('critical','PROFITABILITY_COMPANY_MISMATCH','Profitability',r.id,`${r.entityId} belongs to ${entity.companyId}`);if(!currency(r.currency))push('critical','PROFITABILITY_CURRENCY_MISSING','Profitability',r.id,`Unknown currency ${r.currency}`);});
    (state.integrationMappings||[]).forEach(x=>{if(!(state.enterpriseIntegrations||[]).some(i=>i.id===x.integrationId))push('critical','MAPPING_INTEGRATION_MISSING','Integration Mapping',x.id,`Unknown integration ${x.integrationId}`);});
    (state.integrationSyncJobs||[]).forEach(x=>{if(!(state.enterpriseIntegrations||[]).some(i=>i.id===x.integrationId))push('critical','JOB_INTEGRATION_MISSING','Integration Job',x.id,`Unknown integration ${x.integrationId}`);});
    (state.integrationErrors||[]).forEach(x=>{if(!(state.enterpriseIntegrations||[]).some(i=>i.id===x.integrationId))push('critical','ERROR_INTEGRATION_MISSING','Integration Error',x.id,`Unknown integration ${x.integrationId}`);});
    (state.integrationReconciliation||[]).forEach(x=>{if(!(state.enterpriseIntegrations||[]).some(i=>i.id===x.integrationId))push('critical','RECONCILIATION_INTEGRATION_MISSING','Integration Reconciliation',x.id,`Unknown integration ${x.integrationId}`);if(!currency(x.currency))push('critical','RECONCILIATION_CURRENCY_MISSING','Integration Reconciliation',x.id,`Unknown currency ${x.currency}`);});
    (state.firmwareCampaigns||[]).forEach(c=>{for(const id of c.modelIds||[])if(!(state.chargerModels||[]).some(m=>m.id===id))push('critical','FIRMWARE_MODEL_MISSING','Firmware Campaign',c.id,`Unknown charger model ${id}`);});
    (state.firmwareEvents||[]).forEach(e=>{if(!(state.firmwareCampaigns||[]).some(c=>c.id===e.campaignId))push('critical','FIRMWARE_CAMPAIGN_MISSING','Firmware Event',e.id,`Unknown campaign ${e.campaignId}`);if(e.chargerId&&!charger(e.chargerId))push('warning','FIRMWARE_CHARGER_MISSING','Firmware Event',e.id,`Charger ${e.chargerId} is not in the admin reference registry`);});
    return issues;
  }
  repairDataIntegrity();
  const auditToday=today();
  const auditSeedById=Object.fromEntries(seed.audit.map(item=>[item.id,item]));
  function inferAuditCompanyId(item={}){
    if(item.companyId!==undefined&&item.companyId!==null)return String(item.companyId);
    const text=[item.title,item.detail,item.actor].filter(Boolean).join(' ').toLowerCase();
    const has=value=>{const v=String(value||'').trim().toLowerCase();return Boolean(v&&text.includes(v));};
    const company=(state.companies||[]).find(c=>has(c.name));
    if(company)return company.id;
    const targetUser=(state.userDirectory||[]).find(u=>u.name!==item.actor&&has(u.name));if(targetUser?.companyId)return targetUser.companyId;
    const request=(state.accessRequests||[]).find(r=>has(r.name));if(request?.companyId)return request.companyId;
    const invitation=(state.invitations||[]).find(i=>has(i.name)||has(i.email));if(invitation?.companyId)return invitation.companyId;
    const integration=(state.enterpriseIntegrations||[]).find(i=>has(i.name));if(integration?.companyId)return integration.companyId;
    const tariff=(state.tariffProfiles||[]).find(t=>has(t.name));if(tariff?.companyId)return tariff.companyId;
    const provider=(state.paymentProviders||[]).find(x=>has(x.name));if(provider?.companyId)return provider.companyId;
    const transaction=(state.paymentTransactions||[]).find(x=>has(x.id)||has(x.sessionId)||has(x.driver));if(transaction?.companyId)return transaction.companyId;
    const plan=(state.subscriptionPlans||[]).find(x=>has(x.id)||has(x.name));if(plan?.companyId)return plan.companyId;
    const journal=(state.accountingEntries||[]).find(x=>has(x.id)||has(x.sourceId));if(journal?.companyId)return journal.companyId;
    const mapping=(state.accountingMappings||[]).find(x=>has(x.id)||has(x.source));if(mapping?.companyId)return mapping.companyId;
    const finrec=(state.financialReconciliations||[]).find(x=>has(x.id));if(finrec?.companyId)return finrec.companyId;
    const partner=(state.partners||[]).find(x=>has(x.name)||has(x.id));if(partner?.companyId)return partner.companyId;
    const settlement=(state.settlementRuns||[]).find(x=>has(x.id));if(settlement?.companyId)return settlement.companyId;
    const site=(state.locations||[]).find(x=>has(x.id)||has(x.name));if(site?.companyId)return site.companyId;
    const firmware=(state.firmwareCampaigns||[]).find(c=>has(c.id)||has(c.name));if(firmware?.companyId)return firmware.companyId;
    const actorUser=(state.userDirectory||[]).find(u=>u.name===item.actor);if(actorUser&&!String(actorUser.scope||'').toLowerCase().includes('platform'))return actorUser.companyId||'';
    return '';
  }
  state.audit=(Array.isArray(state.audit)?state.audit:[]).map((item,index)=>{const source={...(auditSeedById[item.id]||{}),...item};return {id:source.id||`AUD-${String(index+1).padStart(3,'0')}`,date:source.date||auditToday,time:source.time||'—',icon:source.icon||'•',module:source.module||inferAuditModule(source),actor:source.actor||currentUser()?.name||state.admin?.name||'Platform Administrator',severity:source.severity||inferAuditSeverity(source),title:source.title||'Administrative action',detail:source.detail||'',source:source.source||'Admin Portal',companyId:inferAuditCompanyId(source)};});
  function addAudit(item){const actor=item.actor||currentUser()?.name||state.admin?.name||'Platform Administrator';const inferredCompanyId=item.companyId!==undefined?String(item.companyId):inferAuditCompanyId({...item,actor});const entry={id:item.id||`AUD-${Date.now()}`,date:item.date||today(),time:item.time||timeNow(),icon:item.icon||'•',module:item.module||inferAuditModule(item),actor,severity:item.severity||inferAuditSeverity(item),title:item.title||'Administrative action',detail:item.detail||'',source:item.source||'Admin Portal',companyId:inferredCompanyId||(isPlatformScope()?'':(currentUser()?.companyId||''))};state.audit.unshift(entry);return entry;}
  seed.audit.forEach(item=>{if(!state.audit.some(x=>x.id===item.id))state.audit.push(JSON.parse(JSON.stringify(item)));});
  const companySeedById=Object.fromEntries(seed.companies.map(c=>[c.id,c]));
  state.companies=(Array.isArray(state.companies)?state.companies:[]).map((company,index)=>{
    const country=seed.countries.find(c=>c.name===company.country||c.code===company.countryCode);
    const fallback={
      id:company.id||`CMP-${String(index+1).padStart(3,'0')}`,name:'Untitled company',legalName:'',companyType:'Network Operator',registrationNumber:'—',taxId:'—',countryCode:country?.code||'AM',country:country?.name||'Armenia',currency:country?.currency||'AMD',timezone:country?.timezone||'Asia/Yerevan',primaryBrand:company.name||'VoltDrive',brands:[company.name||'VoltDrive'],sites:0,users:0,admins:1,billingProfile:'Incomplete',taxProfile:country?.taxProfile||'Not configured',settlementProfile:'Not configured',paymentProfile:'Not configured',contactEmail:'Not configured',address:country?.name||'Not configured',status:'setup',createdAt:today(),lastUpdated:now()
    };
    return {...fallback,...(companySeedById[company.id]||{}),...company};
  });
  function syncAccessStats(){
    const directory=Array.isArray(state.userDirectory)?state.userDirectory:[];
    const invitations=Array.isArray(state.invitations)?state.invitations:[];
    const requests=Array.isArray(state.accessRequests)?state.accessRequests:[];
    const roles=Array.isArray(state.roles)?state.roles:[];
    const directoryActive=directory.filter(u=>u.status==='active');
    const aggregateUsers=(state.companies||[]).reduce((sum,c)=>sum+(Number(c.users)||0),0);
    state.users.active=aggregateUsers||directoryActive.length;
    state.users.directoryTotal=directory.length;
    state.users.directoryActive=directoryActive.length;
    state.users.pendingInvites=invitations.filter(i=>['sent','draft'].includes(i.status)).length;
    state.users.pendingApprovals=requests.filter(r=>r.status==='review').length;
    state.users.directoryWithout2fa=directoryActive.filter(u=>!u.twoFactor).length;
    state.users.without2fa=state.users.directoryWithout2fa;
    state.users.directoryPrivileged=directoryActive.filter(u=>roles.find(r=>r.id===u.roleId)?.privileged).length;
    state.users.privileged=Math.max(Number(seed.users.privileged)||0,state.users.directoryPrivileged);
    state.security.platformTwoFactorCoverage=Number(state.security.platformTwoFactorCoverage??seed.security.twoFactorCoverage??0);
    state.security.directoryTwoFactorCoverage=Math.round((directoryActive.filter(u=>u.twoFactor).length/Math.max(1,directoryActive.length))*100);
    state.security.twoFactorCoverage=state.security.platformTwoFactorCoverage;
    state.security.privilegedUsers=state.users.privileged;
    if(Array.isArray(state.taxProfiles)) state.tariffs.taxProfiles=state.taxProfiles.length;
    if(Array.isArray(state.tariffProfiles)){
      state.tariffs.active=state.tariffProfiles.filter(t=>t.status==='active').length;
      state.tariffs.draft=state.tariffProfiles.filter(t=>t.status==='draft').length;
      state.tariffs.scheduled=state.tariffProfiles.filter(t=>t.status==='scheduled').length;
    }
    if(Array.isArray(state.paymentProviders)) state.tariffs.paymentProviders=state.paymentProviders.length;
    if(Array.isArray(state.securityCertificates)){
      state.security.certificates=state.securityCertificates.length;
      state.security.expiringCertificates=state.securityCertificates.filter(c=>c.status==='expiring').length;
      const certHealth=(state.integrations||[]).find(x=>x.id==='INT-CERT');
      if(certHealth){
        const count=state.security.expiringCertificates;
        certHealth.status=count?'warning':'connected';
        certHealth.detail=count?`${count} certificate${count===1?'':'s'} expire within the renewal window`:'Certificate inventory is inside configured validity thresholds';
        certHealth.latency=count?'Action needed':'Healthy';
      }
    }
    if(Array.isArray(state.blockedEntities)) state.security.blockedEntities=state.blockedEntities.filter(x=>['blocked','revoked'].includes(x.status)).length;
    if(Array.isArray(state.securityEvents)){
      state.security.auditEventsToday=Math.max(47,state.securityEvents.length);
      state.security.criticalEvents=state.securityEvents.filter(x=>x.severity==='critical'&&x.status!=='resolved').length;
    }
    if(Array.isArray(state.aiModels)&&Array.isArray(state.automationRules)&&Array.isArray(state.aiApprovals)){
      state.ai={...seed.ai,...(state.ai||{})};
      state.ai.activeModels=state.aiModels.filter(x=>x.status==='active').length;
      state.ai.automationRules=state.automationRules.filter(x=>x.status==='active').length;
      state.ai.openApprovals=state.aiApprovals.filter(x=>x.status==='review').length;
      const confidences=state.aiModels.filter(x=>x.status==='active').map(x=>Number(x.confidence)||0);
      state.ai.forecastHealth=confidences.length?Math.round(confidences.reduce((a,b)=>a+b,0)/confidences.length):0;
      const aiHealth=(state.integrations||[]).find(x=>x.id==='INT-AI');
      if(aiHealth){aiHealth.status=state.ai.openApprovals?'warning':'connected';aiHealth.detail=`${state.ai.activeModels} active models · ${state.ai.openApprovals} approval${state.ai.openApprovals===1?'':'s'} waiting`;aiHealth.latency=`${state.ai.forecastHealth}% forecast health`;}
    }

    if(Array.isArray(state.energySites)){
      const activeEnergySites=state.energySites.filter(x=>x.status==='active');
      state.energy={...seed.energy,...(state.energy||{})};
      state.energy.managedSites=state.energySites.length;
      state.energy.totalCapacityKw=state.energySites.reduce((sum,x)=>sum+(Number(x.capacityKw)||0),0);
      state.energy.safetyHeadroomKw=state.energySites.reduce((sum,x)=>sum+(Number(x.safetyHeadroomKw)||0),0);
      state.energy.activePolicies=activeEnergySites.length;
      state.energy.demandResponseSites=activeEnergySites.filter(x=>x.demandResponse).length;
      state.energy.setupIssues=state.energySites.filter(x=>x.status!=='active'||x.strategy==='Not configured').length;
      const energyHealth=(state.integrations||[]).find(x=>x.id==='INT-ENERGY');
      if(energyHealth){energyHealth.status=state.energy.setupIssues?'warning':'connected';energyHealth.detail=`${state.energy.activePolicies} active site policies · ${state.energy.demandResponseSites} demand-response capable sites`;energyHealth.latency=`${state.energy.safetyHeadroomKw} kW safety headroom`;}
    }
    if(state.platformSettings?.retention){
      const auditDays=Math.max(30,Number(state.platformSettings.retention.auditDays)||365);
      state.platformSettings.retention.auditDays=auditDays;
      if(state.reportingPolicies) state.reportingPolicies.auditRetentionDays=auditDays;
      if(state.securityPolicies) state.securityPolicies.auditRetentionDays=auditDays;
    }
    const accessAttention=state.attention.find(a=>a.id==='ATT-002');
    if(accessAttention){
      const count=state.users.pendingApprovals;
      accessAttention.title=`${count} access request${count===1?'':'s'} waiting for approval`;
      accessAttention.detail=count?`${count} role and scope request${count===1?'':'s'} require administrator review.`:'No access requests are currently waiting for review.';
      accessAttention.severity=count?'warning':'info';
    }
  }
  function retainedByDays(value,days){
    const date=String(value||'').slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return true;
    const todayMs=Date.parse(`${today()}T00:00:00Z`),itemMs=Date.parse(`${date}T00:00:00Z`);if(!Number.isFinite(todayMs)||!Number.isFinite(itemMs))return true;
    return itemMs>=todayMs-Math.max(30,Number(days)||30)*86400000;
  }
  function applyRetentionPolicies(){
    const auditDays=Math.max(30,Number(state.reportingPolicies?.auditRetentionDays||state.platformSettings?.retention?.auditDays)||365);
    const reportDays=Math.max(30,Number(state.reportingPolicies?.reportRetentionDays)||180);
    if(Array.isArray(state.audit))state.audit=state.audit.filter(item=>retainedByDays(item.date,auditDays));
    if(Array.isArray(state.reportRuns))state.reportRuns=state.reportRuns.filter(item=>retainedByDays(item.runAt,reportDays));
    return {auditDays,reportDays};
  }
  syncAccessStats();
  applyRetentionPolicies();
  function save(){repairDataIntegrity();syncAccessStats();applyRetentionPolicies();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
  function reset(){state=JSON.parse(JSON.stringify(seed));repairDataIntegrity();syncAccessStats();applyRetentionPolicies();save();return state;}
  function nextId(prefix,collection){
    const max=(collection||[]).reduce((n,item)=>Math.max(n,Number(String(item.id||'').replace(/\D/g,''))||0),0);
    return `${prefix}-${String(max+1).padStart(3,'0')}`;
  }
  window.VoltDriveAdmin={getState:()=>state,save,reset,nextId,storageKey:STORAGE_KEY,today,timeNow,now,addDays,addYears,addAudit,applyRetentionPolicies,repairDataIntegrity,validateDataIntegrity,currentUser,currentRole,can,currentAccessScope,normalizeAccessScope,isPlatformScope,scopeAllows,companyInScope,countryInScope,siteInScope,chargerInScope,reportInScope,auditInScope,companyContextId,companyContext,countryContextCode,countryContext,companyContextMatch,countryContextMatch,itemMatchesCompanyContext,contextUrl,countryContextUrl,canGrantScope,canAssignRole,canManageUser,canAccessAdminModule,requirePermission,setCurrentUser:(userId)=>{if(state.userDirectory?.some(u=>u.id===userId)){state.currentSession.userId=userId;save();return true;}return false;}};
})();
