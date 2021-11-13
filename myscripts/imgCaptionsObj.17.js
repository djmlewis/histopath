/******************************************************************************
 * Copyright (c) 13/11/2021 6:33     djml.uk E&OE.                            *
 ******************************************************************************/

let imgCaptionsObj={"histo cholangchhyp p3":"Cholangitis et pericholangitis chronica hyperplastica (Coccidosis hepatis cuniculum.)","histo emphalch p1":"Emphysema alveolaris chronicum","histo emphalch p2":"Emphysema alveolaris chronicum","histo myelnonpurlym p1":"Myelitis non purulenta (lymphocytaria)","histo myelnonpurlym p2":"Myelitis non purulenta (lymphocytaria)","histo nechepcentlob p1":"Necrosis hepatis centrolobularis","histo necrmuscorg p1":"Necrosis musculorum in stadio organizationis: (Zenkers necrosis)","histo nephintpurac p1":"Nephritis interstitialis purulenta acuta (disseminata)","histo nephros p1":"Nephrosis","histo nephros p2":"Nephrosis","histo pleurfibr p1":"Pleuritis fibrinosa","histo pleurfibr p2":"Pleuritis fibrinosa","histo pneuverm p1":"Pneumonia verminosa","histo pneuverm p2":"Pneumonia verminosa","histo sarcomyo p1":"Sarcosporidiosis (Sarcocystis) myocardii / Myositis sarcosporidica","histo sarcomyo p2":"Sarcosporidiosis (Sarcocystis) myocardii / Myositis sarcosporidica","histo semin p1":"Seminoma Testiculi","histo semin p2":"Seminoma Testiculi","histo steathepdys p1":"Steatosis hepatis dystrophica","histo steathepdys p2":"Steatosis hepatis dystrophica","macroslide acpasshypliv p1":"Acute passive hyperemia of liver","macroslide actino p1":"Actinomycosis","macroslide alveemph p1":"Alveolar emphysema","macroslide anthrapulm p1":"Anthracosis pulmonum","macroslide asperpou p1":"Aspergillosis (poultry)","macroslide atelectfet p1":"Atelectasis foetalis (congenital)","macroslide atheroaort p1":"Atherosclerosis (aorta)","macroslide atrphconc p1":"Atrophy of conchae – rhinitis chronica atroficans suum","macroslide autoliv p1":"Autolysis and putrification of liver","macroslide bencuthist p1":"Benign cutaneous histiocytoma","macroslide bileimb p1":"Bile imbibition of liver","macroslide bileimb p2":"Bile imbibition of liver","macroslide bronchcatac p1":"Bronchopneumonia catarrhalis acuta confluens","macroslide carclung p1":"Carcinoma of lungs","macroslide carnpul p1":"Carnificatio pulmonum","macroslide chfibperic p1":"Chronic (adhesive) fibrinous pericarditis","macroslide chrpasshypliv p1":"Chronic passive hyperemia of liver","macroslide cirhepmacro p1":"Cirrhosis hepatis macronodularis","macroslide cirhepmacro p2":"Cirrhosis hepatis macronodularis","macroslide coccidhep p1":"Coccidiosis hepatis","macroslide coldiphth p1":"Colitis diphteroidea (pseudomembranous colitis)","macroslide colitfib p1":"Colitis fibrinosa","macroslide demod p1":"Demodicosis","macroslide dilatcord p1":"Dilatatio cordis","macroslide dilatcordvda p1":"Dilatatio cordis ventriculi dextri acuta","macroslide edemlung p1":"Edema of lungs","macroslide edhyalmusc p1":"Edematisation and hyalinisation of muscles","macroslide emphinter p1":"Emphysema interstitialis","macroslide endvalvver p1":"Endocarditis valvularis verrucosae","macroslide endvalvver p2":"Endocarditis valvularis verrucosae","macroslide entcatth p1":"Enteritis catarrhalis acute diffusa","macroslide enthemdif p1":"Enteritis haemorrhagica diffusa","macroslide entpurdiff p1":"Enteritis purulenta diffusa","macroslide epicardhem p1":"Epicardial hemorrhage","macroslide esmycsarc p1":"Esophagitis and myositis sarcosporidica","macroslide fasciolhep p1":"Fasciolosis hepatis","macroslide folhyspl p1":"Follicular hyperplasia of spleen and lien sulcatus","macroslide galmastcattacu p1":"Galactophoritis et mastitis catarrhalis acute","macroslide heampericard p1":"Hemopericardium","macroslide hemlien p1":"Hemosiderosis lienis","macroslide hemthx p1":"Haemothorax","macroslide hepabsc p1":"Hepatitis abscedens","macroslide hepinter p1":"Hepatitis interstitialis chronica parasitaria disseminata","macroslide hyalmusc p1":"Hyaline degeneration of muscle","macroslide hydrneph p1":"Hydronephrosis","macroslide hydrneph p2":"Hydronephrosis","macroslide hydrneph p3":"Hydronephrosis","macroslide hydroper p1":"Hydropericardium","macroslide hydrperi p1":"Hydroperitoneum","macroslide hyocorvensis p1":"Hypertrophia cordis ventriculi sinistri","macroslide hyperprost p1":"Hypertrophy of prostate","macroslide hypoplaren p1":"Hypoplasia renis","macroslide hypopulm p1":"Hypostasis pulmonum","macroslide hyrdthx p1":"Haemothorax","macroslide icter p1":"Icterus","macroslide imbib p1":"Hemoglobinous imbibition of vessels and endocardium","macroslide infarctren p1":"Infarctus renis anemicus","macroslide infarctren p2":"Infarctus renis anemicus","macroslide intuss p1":"Intussusception","macroslide leydig p1":"Leydig cell tumor","macroslide lipoms p1":"Lipomas","macroslide lymsarclung p1":"Lymphosarcoma in lungs","macroslide lymsarcspl p1":"Lymphosarcoma lienis","macroslide mastacgrav p1":"Mastitis acuta gravis (acute mastitis)","macroslide medcalc p1":"Mediocalcinosis","macroslide mulmesheam p1":"Multiple mesenterial hemorrhages","macroslide myocard p1":"Myocarditis parenchymatosa acute and petechial subepicardial hemorrhages","macroslide necrmusc p1":"Necrosis musculorum","macroslide necrohep p1":"Necrosis hepatis","macroslide necromyoc p1":"Necrosis myocardii","macroslide necromyoc p2":"Necrosis myocardii","macroslide nephcirh p1":"Nephrocirhosis","macroslide nephcystlith p1":"Nephrolith and cystolith","macroslide nephintlymph p1":"Nephritis interstitialis lymphocytaria","macroslide nephintpur p1":"Nephritis interstitialis purulenta chronica","macroslide neterparatb p1":"Enteritis paratuberculosa - Johne’s Disease","macroslide passhypspl p1":"Acute passive hyperemia of spleen","macroslide peritonfibr p1":"Peritonitis fibrinosa","macroslide pethemren p1":"Petechial hemorrhages in renal cortex","macroslide pleurfib p1":"Pleuritis fibrinosa","macroslide pncruplob p1":"Pneumonia cruposa lobaris","macroslide pneuabsce p1":"Pneumonia abscedens","macroslide pneumintest p1":"Pneumatosis intestini","macroslide pneuverm p1":"Pneumonia verminosa","macroslide polyov p1":"Polycystosis ovarii","macroslide polyserfib p1":"Polyserositis fibrinosa - Glasser’s disease","macroslide pseudmelcol p1":"Pseudomelanosis cutis","macroslide rach p1":"Rhachitis (rickets)","macroslide semino p1":"Seminoma","macroslide semino p2":"Seminoma","macroslide seqren p1":"Sequestratio renis","macroslide steathep p1":"Steatosis hepatis","macroslide synfib p1":"Synovitis fibrinosa","macroslide tbclung p1":"Pulmonary tuberculosis","macroslide tbcpoul p1":"Mycobacterium avium","macroslide tbintest p1":"Tuberculosis intestini - Bovine intestinal tuberculosis","macroslide tbln p1":"Tuberculosis lymphadenopathy","macroslide trachcrup p1":"Tracheitis cruposa","macroslide traumperic p1":"Traumatic pericarditis, Cor villosum","macroslide traumperic p2":"Traumatic pericarditis, Cor villosum","macroslide ulcvent p1":"Ulcus ventriculi (gastric ulcer)"}