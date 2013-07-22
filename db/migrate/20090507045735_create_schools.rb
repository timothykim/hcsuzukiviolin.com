class CreateSchools < ActiveRecord::Migration
  def self.up
    create_table :schools do |t|
      t.column :name, :string
      t.column :address, :string
      t.column :zip, :string
    end

    School.create :name => "HC Studio", :address => "501 Roosevelt Boulevard, Apt. #B124", :zip => "22044"
    School.create :name => "CIFA", :address => "103 West Columbia St.", :zip => "22046"
    School.create :name => "CHMS", :address => "2425-A North Glebe Road", :zip => "22207"
  end

  def self.down
    drop_table :schools
  end
end
