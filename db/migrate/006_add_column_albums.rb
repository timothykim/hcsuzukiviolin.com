class AddColumnAlbums < ActiveRecord::Migration
  def self.up
    add_column :albums, :description, :text
  end

  def self.down
    remove_column :albums, :description
  end
end
