class CreateAnnouncements < ActiveRecord::Migration
  def self.up
    create_table :announcements do |t|
      t.column :content,            :text
      t.timestamps
    end
    
    Option.create :name => "Number of Frontpage Announcements", :value => "3"
  end

  def self.down
    drop_table :announcements
  end
end
