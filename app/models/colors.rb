class Colors
  def self.all
    [ "CC3333",
      "DD4477",
      "994499",
      "6633CC",
      "336699",
      "3366CC",
      "22AA99",
      "329262",
      "0F9618",
      "66AA00",
      "AAAA11",
      "D6AE00",
      "EE8800",
      "DD5511",
      "A87070",
      "8C6D8C",
      "627487",
      "7083A8",
      "5C8D87",
      "898951",
      "B08B59" ]
  end

  def self.light_all
    [ "f2e2e2", 
      "e2fde6",
      "e6edf2" ]
  end

  def self.one(num)
    self.all[num % self.all.length]
  end

  def self.light_one(num)
    self.light_all[num % self.light_all.length]
  end
end
