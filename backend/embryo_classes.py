# Model sınıf tanımlamaları
EMBRYO_CLASSES = {
    '2-1-1': {
        'hücre_sayısı': '2',
        'fragmentasyon': 'Düşük',
        'simetri': 'İyi',
        'açıklama': '2 hücreli embriyo, düşük fragmentasyon seviyesinde ve iyi simetriye sahip. Blastomer düzeni düzenli.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo varsa, öncelik verilebilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli orta düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon yildiz': '★★★★☆',
            'simetri_yildiz': '★★★★☆',
            'genel_kalite': '★★★★☆'
        }
    },
    '2-1-2': {
        'hücre_sayısı': '2',
        'fragmentasyon': 'Düşük',
        'simetri': 'Orta',
        'açıklama': '2 hücreli embriyo, düşük fragmentasyon seviyesinde ve orta düzeyde simetriye sahip. Blastomer düzeni kabul edilebilir.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo varsa, öncelik verilebilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli orta düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★★☆',
            'simetri_yildiz': '★★★☆☆',
            'genel_kalite': '★★★☆☆'
        }
    },
    '2-1-3': {
        'hücre_sayısı': '2',
        'fragmentasyon': 'Düşük',
        'simetri': 'Kötü',
        'açıklama': '2 hücreli embriyo, düşük fragmentasyon seviyesinde ancak simetri açısından zayıf. Blastomer düzeninde düzensizlik mevcut.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo mevcutsa, onlara öncelik verilmesi önerilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli düşük-orta düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★★☆',
            'simetri_yildiz': '★☆☆☆☆',
            'genel_kalite': '★★☆☆☆'
        }
    },
    '2-2-1': {
        'hücre_sayısı': '2',
        'fragmentasyon': 'Orta',
        'simetri': 'İyi',
        'açıklama': '2 hücreli embriyo, orta düzeyde fragmentasyon ve iyi simetriye sahip. Blastomer düzeni düzenli.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo varsa, öncelik verilebilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli orta düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★☆☆',
            'simetri_yildiz': '★★★★☆',
            'genel_kalite': '★★★☆☆'
        }
    },
    '2-2-2': {
        'hücre_sayısı': '2',
        'fragmentasyon': 'Orta',
        'simetri': 'Orta',
        'açıklama': '2 hücreli embriyo, orta düzeyde fragmentasyon ve orta düzeyde simetriye sahip. Blastomer düzeni kabul edilebilir.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo varsa, öncelik verilebilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli orta düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★☆☆',
            'simetri_yildiz': '★★★☆☆',
            'genel_kalite': '★★★☆☆'
        }
    },
    '2-2-3': {
        'hücre_sayısı': '2',
        'fragmentasyon': 'Orta',
        'simetri': 'Kötü',
        'açıklama': '2 hücreli embriyo, orta düzeyde fragmentasyon ve zayıf simetriye sahip. Blastomer düzeninde belirgin düzensizlik mevcut.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo mevcutsa, onlara öncelik verilmesi önerilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli düşük düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★☆☆',
            'simetri_yildiz': '★☆☆☆☆',
            'genel_kalite': '★★☆☆☆'
        }
    },
    '2-3-3': {
        'hücre_sayısı': '2',
        'fragmentasyon': 'Yüksek',
        'simetri': 'Kötü',
        'açıklama': '2 hücreli embriyo, yüksek düzeyde fragmentasyon ve zayıf simetriye sahip. Blastomer düzeninde ciddi düzensizlik mevcut.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Ancak daha iyi kalitede embriyo mevcutsa, onlara öncelik verilmesi önemle önerilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli çok düşük düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★☆☆☆☆',
            'simetri_yildiz': '★☆☆☆☆',
            'genel_kalite': '★☆☆☆☆'
        }
    },
    '3-1-1': {
        'hücre_sayısı': '3',
        'fragmentasyon': 'Düşük',
        'simetri': 'İyi',
        'açıklama': '3 hücreli embriyo, düşük fragmentasyon seviyesinde ve iyi simetriye sahip. Blastomer düzeni düzenli, hücreler benzer boyutta.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Gelişim hızı uygun.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli iyi düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★★☆',
            'simetri_yildiz': '★★★★☆',
            'genel_kalite': '★★★★☆'
        }
    },
    '3-1-2': {
        'hücre_sayısı': '3',
        'fragmentasyon': 'Düşük',
        'simetri': 'Orta',
        'açıklama': '3 hücreli embriyo, düşük fragmentasyon seviyesinde ve orta düzeyde simetriye sahip. Blastomer düzeni kabul edilebilir.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo varsa, öncelik verilebilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli orta-iyi düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★★☆',
            'simetri_yildiz': '★★★☆☆',
            'genel_kalite': '★★★☆☆'
        }
    },
    '3-1-3': {
        'hücre_sayısı': '3',
        'fragmentasyon': 'Düşük',
        'simetri': 'Kötü',
        'açıklama': '3 hücreli embriyo, düşük fragmentasyon seviyesinde ancak simetri açısından zayıf. Blastomer boyutlarında belirgin farklılıklar mevcut.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo mevcutsa, onlara öncelik verilmesi önerilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli orta düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★★☆',
            'simetri_yildiz': '★☆☆☆☆',
            'genel_kalite': '★★★☆☆'
        }
    },
    '3-2-1': {
        'hücre_sayısı': '3',
        'fragmentasyon': 'Orta',
        'simetri': 'İyi',
        'açıklama': '3 hücreli embriyo, orta düzeyde fragmentasyon ve iyi simetriye sahip. Blastomer düzeni düzenli.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo varsa, öncelik verilebilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli orta düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★☆☆',
            'simetri_yildiz': '★★★★☆',
            'genel_kalite': '★★★☆☆'
        }
    },
    '3-2-2': {
        'hücre_sayısı': '3',
        'fragmentasyon': 'Orta',
        'simetri': 'Orta',
        'açıklama': '3 hücreli embriyo, orta düzeyde fragmentasyon ve orta düzeyde simetriye sahip. Blastomer düzeni kabul edilebilir.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo varsa, öncelik verilebilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli orta düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★☆☆',
            'simetri_yildiz': '★★★☆☆',
            'genel_kalite': '★★★☆☆'
        }
    },
    '3-2-3': {
        'hücre_sayısı': '3',
        'fragmentasyon': 'Orta',
        'simetri': 'Kötü',
        'açıklama': '3 hücreli embriyo, orta düzeyde fragmentasyon ve zayıf simetriye sahip. Blastomer düzeninde belirgin düzensizlik mevcut.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo mevcutsa, onlara öncelik verilmesi önerilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli düşük düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★☆☆',
            'simetri_yildiz': '★☆☆☆☆',
            'genel_kalite': '★★☆☆☆'
        }
    },
    '3-3-2': {
        'hücre_sayısı': '3',
        'fragmentasyon': 'Yüksek',
        'simetri': 'Orta',
        'açıklama': '3 hücreli embriyo, yüksek düzeyde fragmentasyon ve orta düzeyde simetriye sahip. Blastomer düzeninde düzensizlik mevcut.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo mevcutsa, onlara öncelik verilmesi önemle önerilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli düşük düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★☆☆☆☆',
            'simetri_yildiz': '★★★☆☆',
            'genel_kalite': '★★☆☆☆'
        }
    },
    '3-3-3': {
        'hücre_sayısı': '3',
        'fragmentasyon': 'Yüksek',
        'simetri': 'Kötü',
        'açıklama': '3 hücreli embriyo, yüksek düzeyde fragmentasyon ve zayıf simetriye sahip. Blastomer düzeninde ciddi düzensizlik mevcut.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo mevcutsa, onlara öncelik verilmesi önemle önerilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli çok düşük düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★☆☆☆☆',
            'simetri_yildiz': '★☆☆☆☆',
            'genel_kalite': '★☆☆☆☆'
        }
    },
    '4-2-2': {
        'hücre_sayısı': '4',
        'fragmentasyon': 'Orta',
        'simetri': 'Orta',
        'açıklama': '4 hücreli embriyo, orta düzeyde fragmentasyon ve orta düzeyde simetriye sahip. Blastomer düzeni kabul edilebilir.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Daha iyi kalitede embriyo varsa, öncelik verilebilir.',
        'risk_notu': 'Morfolojik yapısı göz önünde bulundurularak implantasyon potansiyeli orta düzeyde değerlendirilebilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★☆☆',
            'simetri_yildiz': '★★★☆☆',
            'genel_kalite': '★★★☆☆'
        }
    },
    'Arrested': {
        'hücre_sayısı': 'Belirsiz',
        'fragmentasyon': 'Yüksek',
        'simetri': 'Kötü',
        'açıklama': 'Gelişimi durmuş embriyo. Bölünme aşamasında duraksama görülmüştür. Hücre bölünmesinde ilerleme yok.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için genellikle uygun bulunmaz. Alternatif embriyoların değerlendirilmesi önerilir.',
        'risk_notu': 'Gelişimi durmuş embriyolarda implantasyon potansiyeli çok düşük düzeyde değerlendirilir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★☆☆☆☆',
            'simetri_yildiz': '★☆☆☆☆',
            'genel_kalite': '★☆☆☆☆'
        }
    },
    'Early': {
        'hücre_sayısı': '2-4',
        'fragmentasyon': 'Değişken',
        'simetri': 'Değişken',
        'açıklama': 'Erken bölünme aşamasında embriyo. Gelişim devam ediyor. Blastomer düzeni henüz tam olarak değerlendirilemez.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak daha ileri gelişim aşamasında değerlendirilmesi önerilir. Gözlem altında tutulması uygundur.',
        'risk_notu': 'Erken aşamada olduğu için gelişim ve implantasyon potansiyeli hakkında kesin değerlendirme yapmak için daha fazla gözlem gereklidir.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★☆☆',
            'simetri_yildiz': '★★★☆☆',
            'genel_kalite': '★★★☆☆'
        }
    },
    'Morula': {
        'hücre_sayısı': '16+',
        'fragmentasyon': 'Düşük',
        'simetri': 'İyi',
        'açıklama': 'Kompakt hücre aşamasında embriyo. Blastokiste geçiş bekleniyor. Hücreler bir araya gelerek solid bir kütle oluşturmuş.',
        'transfer_uygunlugu': 'Klinik değerlendirmeye bağlı olarak transfer için değerlendirilebilir. Blastokist aşamasına geçiş potansiyeli yüksek olan embriyolardır.',
        'risk_notu': 'Morula aşamasındaki embriyolar, blastokist aşamasına geçiş yapabilirse implantasyon potansiyeli yüksek düzeyde değerlendirilebilir. Trofektoderm gelişimi bu aşamada başlamaktadır.',
        'vizuel': {
            'fragmentasyon_yildiz': '★★★★☆',
            'simetri_yildiz': '★★★★☆',
            'genel_kalite': '★★★★☆'
        }
    }
}
