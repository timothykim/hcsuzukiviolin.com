class AddCounters < ActiveRecord::Migration
  def self.up
    add_column :users, :albums_count, :integer, :default => 0, :null => false
    add_column :users, :photos_count, :integer, :default => 0, :null => false
    add_column :albums, :photos_count, :integer, :default => 0, :null => false
  end

  def self.down
    remove_column :users, :albums_count
    remove_column :users, :photos_count
    remove_column :albums, :photos_count
  end
end
