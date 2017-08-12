class CreateContents < ActiveRecord::Migration
  def self.up
    create_table :contents do |t|
      t.column :name, :string, :unique => true
      t.column :html, :text
      t.timestamps
    end
  end

  def self.down
    drop_table :contents
  end
end
