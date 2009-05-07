class CreateSummerSchools < ActiveRecord::Migration
  def self.up
    create_table :summer_schools do |t|
      t.column :name, :string
    end

    SummerSchool.create :name => "CIFA"
    SummerSchool.create :name => "CHMS"
  end

  def self.down
    drop_table :summer_schools
  end
end
