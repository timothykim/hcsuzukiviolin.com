class AddSessionReadyColumn < ActiveRecord::Migration
  def self.up
    add_column :sessions, :is_ready, :boolean, :default => false
  end

  def self.down
    remove_column :sessions, :is_ready
  end
end
