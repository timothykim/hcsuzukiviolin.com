class CreateOptions < ActiveRecord::Migration
  def self.up
    create_table :options do |t|
      t.column :name,   :string
      t.column :value,  :string
    end
    
    Option.create :name => "Site name", :value => "Greater Washington Suzuki Music School"
    Option.create :name => "Theme", :value => "greentop"

  end

  def self.down
    drop_table :options
  end
end
