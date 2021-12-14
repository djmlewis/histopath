/******************************************************************************
 * Copyright (c) 14/12/2021 3:11     djml.uk E&OE.                            *
 ******************************************************************************/

let imgCaptionsObj={"histo accattpurbronpn p1u":"Acute catarrhal purulent bronchopneumonia (Pneumonia purulenta)","histo actino p1u":"Actinomycosis (maxilla)","histo actino p2r":"Actinomycosis (maxilla)","histo anthpulmmedln p1u":"Anthracosis pulmonum et mediatinal LN","histo anthpulmmedln p2r":"Anthracosis pulmonum et mediatinal LN","histo anthpulmmedln p3r":"Anthracosis pulmonum et mediatinal LN","histo atelpulm p1u":"Atelectasis pulmonum","histo carsimmamadeno p1u":"Carcinoma simplex mammae (adenocarcinoma)","histo carsimmamadeno p2r":"Carcinoma simplex mammae (adenocarcinoma)","histo cholangchhyp p3r":"Cholangitis et pericholangitis chronica hyperplastica (Coccidosis hepatis cuniculum.)","histo demod p1u":"Demodicosis","histo dyhynecmuzenk p1r":"Dystrophia hyalinoidea et necrosis musculorum (Zenkers degeneration) Dystrophia Musculorum","histo dysentsui p1r":"Dysenteria suis / Colitis fibrinosa","histo emphalch p1u":"Emphysema alveolaris chronicum","histo emphalch p2r":"Emphysema alveolaris chronicum","histo endobperinod p1u":"Endobronchiolitis obliterans et peribronchiolitis nodosa","histo endobperinod p2r":"Endobronchiolitis obliterans et peribronchiolitis nodosa","histo entparatb p1r":"Enteritis paratuberculosa (Ziehl-Nielsen) – Johne's disease","histo entspectb p1u":"Enteritis specifica tuberculosa / enteritis tuberculosa nodosa","histo entspectb p2r":"Enteritis specifica tuberculosa / enteritis tuberculosa nodosa","histo epidcyst p1u":"Epidermoid cyst","histo epidcyst p2r":"Epidermoid cyst","histo fibrmoll p1u":"Fibroma molle","histo fibrmoll p2b":"Fibroma molle","histo fibsarccervut p1u":"Fibrosarcoma cervicis uteri","histo fibsarccervut p2r":"Fibrosarcoma cervicis uteri","histo galmastcatac p1r":"Galactophoritis et mastitis catarrhalis acuta","histo galmastcatchr p1r":"Galactophoritis et mastitis catarrhalis chronica","histo glomchr p1u":"Glomerulonephritis chronica (Degeneratio renis hyalinosa)","histo glomchr p2r":"Glomerulonephritis chronica (Degeneratio renis hyalinosa)","histo haemangcav p1r":"Hemangioma cavernosum","histo haemlien p1u":"Haemosiderosis lienis","histo haemlien p2b":"Haemosiderosis lienis","histo heptbnod p1u":"Hepatitis Tuberculosa nodusa (hepatis specifica TBC)","histo histiocut p1r":"Histiocytoma cutis (benign cutaneous histiocytoma)","histo infarcrenanemsui p1u":"Infarctus renis anemicus suis (anemic infarct of kidney)","histo infarcrenanemsui p2r":"Infarctus renis anemicus suis (anemic infarct of kidney)","histo lymphosarc p1r":"Lymphosarcoma (Leucosis lymphadenoidea hepatis)","histo medcalc p1u":"Mediocalcinosis","histo medcalc p2r":"Mediocalcinosis","histo meninspinpur p1r":"Meningitis spinalis purulenta","histo myelnonpurlym p1u":"Myelitis non purulenta (lymphocytaria)","histo myelnonpurlym p2r":"Myelitis non purulenta (lymphocytaria)","histo myelpur p1u":"Myelitis purulenta","histo myocardpur p1u":"Myocarditis purulenta","histo nechepcentlob p1r":"Necrosis hepatis centrolobularis","histo nechepfoc p1u":"Necrosis hepatis focalis","histo necrmuscorg p1r":"Necrosis musculorum in stadio organizationis: (Zenkers necrosis)","histo nephintpurac p1u":"Nephritis interstitialis purulenta acuta (disseminata)","histo nephintpurac p2b":"Nephritis interstitialis purulenta acuta (disseminata)","histo nephros p1u":"Nephrosis","histo nephros p2b":"Nephrosis","histo pleurfibr p1u":"Pleuritis fibrinosa","histo pleurfibr p2r":"Pleuritis fibrinosa","histo pneuverm p1u":"Pneumonia verminosa","histo pneuverm p2r":"Pneumonia verminosa","histo sarcomyo p1b":"Sarcosporidiosis (Sarcocystis) myocardii / Myositis sarcosporidica","histo sarcomyo p2r":"Sarcosporidiosis (Sarcocystis) myocardii / Myositis sarcosporidica","histo semin p1u":"Seminoma Testiculi","histo semin p2b":"Seminoma Testiculi","histo steathepdys p1u":"Steatosis hepatis dystrophica","histo steathepdys p2r":"Steatosis hepatis dystrophica","histo trichmusc p1r":"Trichinosis musculorum","histo tummixmam p1u":"Tumor mixtus mammae","histo tummixmam p2r":"Tumor mixtus mammae","macroslide acpasshypliv p1a":"Acute passive hyperemia of liver","macroslide actino p1a":"Actinomycosis","macroslide alveemph p1a":"Alveolar emphysema","macroslide anthrapulm p1a":"Anthracosis pulmonum","macroslide asperpou p1a":"Aspergillosis (poultry)","macroslide atelectfet p1a":"Atelectasis foetalis (congenital)","macroslide atheroaort p1a":"Atherosclerosis (aorta)","macroslide atrphconc p1a":"Atrophy of conchae – rhinitis chronica atroficans suum","macroslide autoliv p1a":"Autolysis and putrification of liver","macroslide bencuthist p1a":"Benign cutaneous histiocytoma","macroslide bileimb p1a":"Bile imbibition of liver","macroslide bileimb p2u":"Bile imbibition of liver","macroslide bronchcatac p1a":"Bronchopneumonia catarrhalis acuta confluens","macroslide carclung p1a":"Carcinoma of lungs","macroslide carnpul p1a":"Carnificatio pulmonum","macroslide chfibperic p1a":"Chronic (adhesive) fibrinous pericarditis","macroslide chrpasshypliv p1a":"Chronic passive hyperemia of liver","macroslide cirhepmacro p1a":"Cirrhosis hepatis macronodularis","macroslide cirhepmacro p2a":"Cirrhosis hepatis macronodularis","macroslide coccidhep p1a":"Coccidiosis hepatis","macroslide coldiphth p1a":"Colitis diphteroidea (pseudomembranous colitis)","macroslide colitfib p1a":"Colitis fibrinosa","macroslide demod p1u":"Demodicosis","macroslide dilatcord p1a":"Dilatatio cordis","macroslide dilatcordvda p1u":"Dilatatio cordis ventriculi dextri acuta","macroslide edemlung p1a":"Edema of lungs","macroslide edhyalmusc p1u":"Edematisation and hyalinisation of muscles","macroslide emphinter p1a":"Emphysema interstitialis","macroslide endvalvver p1a":"Endocarditis valvularis verrucosae","macroslide endvalvver p2u":"Endocarditis valvularis verrucosae","macroslide entcatth p1u":"Enteritis catarrhalis acute diffusa","macroslide enthemdif p1a":"Enteritis haemorrhagica diffusa","macroslide entpurdiff p1u":"Enteritis purulenta diffusa","macroslide epicardhem p1a":"Epicardial hemorrhage","macroslide esmycsarc p1a":"Esophagitis and myositis sarcosporidica","macroslide fasciolhep p1u":"Fasciolosis hepatis","macroslide folhyspl p1u":"Follicular hyperplasia of spleen and lien sulcatus","macroslide galmastcattacu p1u":"Galactophoritis et mastitis catarrhalis acute","macroslide heampericard p1u":"Hemopericardium","macroslide hemlien p1a":"Hemosiderosis lienis","macroslide hemthx p1a":"Haemothorax","macroslide hepabsc p1u":"Hepatitis abscedens","macroslide hepinter p1a":"Hepatitis interstitialis chronica parasitaria disseminata","macroslide hyalmusc p1a":"Hyaline degeneration of muscle","macroslide hydrneph p1a":"Hydronephrosis","macroslide hydrneph p2u":"Hydronephrosis","macroslide hydrneph p3u":"Hydronephrosis","macroslide hydroper p1a":"Hydropericardium","macroslide hydrperi p1a":"Hydroperitoneum","macroslide hyocorvensis p1u":"Hypertrophia cordis ventriculi sinistri","macroslide hyperprost p1a":"Hypertrophy of prostate","macroslide hypoplaren p1a":"Hypoplasia renis","macroslide hypopulm p1a":"Hypostasis pulmonum","macroslide hyrdthx p1u":"Haemothorax","macroslide icter p1a":"Icterus","macroslide imbib p1a":"Hemoglobinous imbibition of vessels and endocardium","macroslide infarctren p1a":"Infarctus renis anemicus","macroslide infarctren p2u":"Infarctus renis anemicus","macroslide intuss p1a":"Intussusception","macroslide leydig p1u":"Leydig cell tumor","macroslide lipoms p1a":"Lipomas","macroslide lymsarclung p1a":"Lymphosarcoma in lungs","macroslide lymsarcspl p1u":"Lymphosarcoma lienis","macroslide mastacgrav p1a":"Mastitis acuta gravis (acute mastitis)","macroslide medcalc p1u":"Mediocalcinosis","macroslide mulmesheam p1a":"Multiple mesenterial hemorrhages","macroslide myocard p1u":"Myocarditis parenchymatosa acute and petechial subepicardial hemorrhages","macroslide necrmusc p1u":"Necrosis musculorum","macroslide necrohep p1a":"Necrosis hepatis","macroslide necromyoc p1a":"Necrosis myocardii","macroslide necromyoc p2u":"Necrosis myocardii","macroslide nephcirh p1a":"Nephrocirhosis","macroslide nephcystlith p1a":"Nephrolith and cystolith","macroslide nephintlymph p1u":"Nephritis interstitialis lymphocytaria","macroslide nephintpur p1a":"Nephritis interstitialis purulenta chronica","macroslide neterparatb p1a":"Enteritis paratuberculosa - Johne’s Disease","macroslide passhypspl p1a":"Acute passive hyperemia of spleen","macroslide peritonfibr p1u":"Peritonitis fibrinosa","macroslide pethemren p1a":"Petechial hemorrhages in renal cortex","macroslide pleurfib p1a":"Pleuritis fibrinosa","macroslide pncruplob p1a":"Pneumonia cruposa lobaris","macroslide pneuabsce p1a":"Pneumonia abscedens","macroslide pneumintest p1u":"Pneumatosis intestini","macroslide pneuverm p1a":"Pneumonia verminosa","macroslide polyov p1a":"Polycystosis ovarii","macroslide polyserfib p1a":"Polyserositis fibrinosa - Glasser's disease","macroslide pseudmelcol p1a":"Pseudomelanosis cutis","macroslide rach p1u":"Rhachitis (rickets)","macroslide semino p1a":"Seminoma","macroslide semino p2u":"Seminoma","macroslide seqren p1a":"Sequestratio renis","macroslide steathep p1a":"Steatosis hepatis","macroslide synfib p1a":"Synovitis fibrinosa","macroslide tbclung p1a":"Pulmonary tuberculosis","macroslide tbcpoul p1a":"Mycobacterium avium","macroslide tbintest p1a":"Tuberculosis intestini - Bovine intestinal tuberculosis","macroslide tbln p1a":"Tuberculosis lymphadenopathy","macroslide trachcrup p1a":"Tracheitis cruposa","macroslide traumperic p1a":"Traumatic pericarditis, Cor villosum","macroslide traumperic p2u":"Traumatic pericarditis, Cor villosum","macroslide ulcvent p1a":"Ulcus ventriculi (gastric ulcer)"};
let chapterDiagnosesObj={"macr":["Dermatology", "Digestive Tract", "Haematopoietic", "Heart", "Infectious Diseases", "Liver", "Muscle", "Oncology", "Post mortem changes", "Renal - Urinary Tract", "Reproductive System", "Respiratory", "Rheumatology", "Vascular"],"hist":["Dermatology", "Haematopoietic", "Heart", "Infectious Diseases", "Liver", "Muscle", "Neurology", "Oncology", "Renal - Urinary Tract", "Respiratory", "Vascular"]};